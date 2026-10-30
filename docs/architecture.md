# Kiến trúc & quy ước code — Rentify Frontend

Tài liệu mô tả cách tổ chức `fe/src` và các "base" dùng chung (gọi API, response/phân trang, toast, hook query/mutation, form, component). Đọc trước khi thêm feature mới.

## 1. Cấu trúc thư mục

```
src/
├── app/                  # Khung ứng dụng: provider, routes, layouts, trang hệ thống (403/404, dashboard)
├── components/
│   ├── ui/               # Primitive của design system (Button, Input, Card, Dialog…)
│   ├── feedback/         # Loading, Skeleton, EmptyState, ErrorState, AlertBanner
│   └── guards/           # Can (ẩn/hiện theo role)
├── config/               # Cấu hình tĩnh (menu điều hướng theo role)
├── hooks/                # Hook generic, không biết gì về nghiệp vụ (useDebounce, useDisclosure)
├── i18n/                 # i18next + locales (xem docs/i18n-guidelines.md)
├── lib/
│   ├── api/
│   │   ├── client.ts         # axios instance: gắn Bearer token, toast thành công/lỗi
│   │   ├── refresh-token.ts  # 401 → refresh token một lần rồi gọi lại request
│   │   ├── http.ts           # http.get/getPage/getBlob/post/put/patch/delete — đã bóc envelope
│   │   ├── errors.ts         # getErrorMessage, getApiErrorCode
│   │   └── api-messages.ts   # Dịch mã thành công/lỗi của API sang text
│   ├── query/
│   │   ├── query-client.ts   # QueryClient (retry, staleTime)
│   │   └── types.ts          # MutationHookOptions
│   ├── utils/            # cn.ts, format.ts (formatVnd, formatDate…)
│   └── form.ts           # getFieldError, setFormApiErrors cho react-hook-form
├── stores/               # Zustand (auth-store)
├── types/                # Kiểu dùng chung: api.ts (envelope, phân trang), user.ts, role.ts
└── features/<tên>/
    ├── api/<tên>.api.ts      # Hàm gọi API (request thuần, không React)
    ├── hooks/                # Hook TanStack bọc API: use-xxx-query.ts, use-xxx-mutation.ts
    ├── forms/                # Form: schema Zod (xxx.schema.ts) + hook form (use-xxx-form.ts)
    ├── constants/            # <TÊN>_QUERY_KEYS, hằng nghiệp vụ, mã lỗi do chính FE tạo ra
    ├── types/<tên>.dto.ts    # Request/response DTO, chép từ api-docs
    ├── components/  pages/  utils/
```

**Ba tầng trong một feature**, mỗi tầng chỉ gọi tầng ngay dưới nó:

```
pages/  ──►  forms/use-xxx-form.ts   (validate, state form, điều hướng sau khi submit)
                    │
                    ▼
             hooks/use-xxx-mutation.ts / use-xxx-query.ts   (cache, loading, cập nhật store)
                    │
                    ▼
             api/xxx.api.ts   (gọi HTTP)
```

Trang không có form thì gọi thẳng hook trong `hooks/`.

**Quy tắc phụ thuộc**

- `lib/`, `types/`, `components/`, `hooks/` **không** import từ `features/` hay `app/`.
- Trong cùng một feature dùng đường dẫn tương đối (`../api/auth.api`); từ ngoài vào dùng alias `@/features/...`.
- Feature không gọi `apiClient`/`axios` trực tiếp, mà luôn đi qua `http` (ngoại lệ duy nhất: `mediaApi.putToStorage` PUT lên presigned URL của storage).
- **Không dùng file `index.ts` (barrel).** Import thẳng file chứa thứ cần dùng, ví dụ `import { Button } from '@/components/ui/button'`.
- Không viết file test (`*.test.ts`).

**Đặt type ở đâu**

- DTO request/response và type chỉ một feature dùng thì đặt trong `features/<tên>/types/<tên>.dto.ts`. Kiểu dữ liệu của form lấy từ schema (`z.infer`) và nằm cạnh schema trong `forms/`.
- `src/types/` chỉ chứa type mà phần dùng chung (`lib/`, `stores/`, `app/`) cần tới: envelope và phân trang (`api.ts`), `User` (do `stores/auth-store` giữ, và `lib/api` đọc token từ store này) và `Role` (dùng cho route, menu, guard).
- Khi một type của feature A bắt đầu được feature B dùng thì chuyển nó lên `src/types/`. Không để feature B import từ `features/A/types`.

## 2. Response, request, phân trang

Kiểu envelope nằm ở [`src/types/api.ts`](../src/types/api.ts) và khớp `api-docs/src/responses/wrappers/*`:

| Kiểu | Ý nghĩa |
|---|---|
| `ApiResponse<T>` | `{ statusCode, code, data: T }` — envelope một đối tượng |
| `PaginatedApiResponse<T>` | `ApiResponse<T[]>` + `pagination: PaginationMeta` |
| `Paginated<T>` | `{ items: T[], pagination }` — kết quả của `http.getPage()` sau khi bóc envelope |
| `ApiErrorResponse` | `{ statusCode, code }` — body lỗi |
| `PaginationParams` | `pageNo`, `pageSize`, `sort`, `order` |
| `ListParams<TFilter>` | `PaginationParams` + `filter` (deepObject, ví dụ `filter[status]=available`) |

`http.*` tự bóc `{ statusCode, code, data }` nên ở feature chỉ cần khai báo kiểu payload:

```ts
// features/rooms/api/rooms.api.ts
import { http } from '@/lib/api/http';
import type { ListParams } from '@/types/api';

export const roomsApi = {
  list: (params?: ListParams<RoomFilter>) => http.getPage<RoomDto, RoomFilter>('/me/rooms', params),
  getById: (id: string) => http.get<RoomDetailDto>(`/rooms/${id}`),
  create: (body: CreateRoomRequestDto) => http.post<RoomDetailDto>('/rooms', body),
  remove: (id: string) => http.delete(`/rooms/${id}`), // mặc định Promise<void>
};
```

## 3. Toast thành công / lỗi

Cả hai loại toast đều nằm ở **một chỗ**: interceptor trong [`lib/api/client.ts`](../src/lib/api/client.ts). Hook và component không tự toast lỗi API.

FE **không khai báo hằng** cho mã mà backend trả về. Backend trả `code`, interceptor lấy đúng `code` đó đi dịch:

- **Thành công:** sau mỗi request ghi (POST/PUT/PATCH/DELETE), tra `<ns>:apiSuccess.<CODE>`. Có bản dịch thì toast, không có thì bỏ qua. Muốn một mã thành công hiện toast thì chỉ cần thêm bản dịch.
- **Lỗi:** mọi request lỗi (trừ request bị huỷ) đều được toast bằng `getErrorMessage(error)`. Hàm này tra `<ns>:apiErrors.<CODE>` (lần lượt `auth` → `media` → `common`); nếu mã không có bản dịch thì dùng câu theo HTTP status. Một 401 đã được refresh token xử lý xong thì không toast.
- **Tắt toast cho một request:** truyền `{ skipSuccessToast: true }` / `{ skipErrorToast: true }` vào config. Endpoint chỉ được gọi từ form (đăng nhập, đăng ký…) đặt sẵn `skipErrorToast` trong file `*.api.ts`, vì form đã hiện lỗi ngay trong form.
- Hằng mã lỗi chỉ dùng cho mã **do FE tự tạo ra** (validate file, lỗi PUT lên storage, huỷ upload…), xem `MEDIA_ERROR_CODES`. Những lỗi này không đi qua axios, nên nơi tạo ra chúng tự toast (xem `uploadMedia`).

## 4. Query key & hook query/mutation

**Query key là gì?** TanStack Query lưu kết quả mỗi query vào cache theo một "địa chỉ" là query key (một mảng). Key dùng vào ba việc:

1. **Cache và gộp request:** hai component cùng gọi `useCurrentUserQuery()` có chung key `['auth', 'me']`, nên chỉ có một request và cả hai dùng chung dữ liệu.
2. **Làm mới sau khi ghi:** tạo phòng xong thì gọi `invalidateQueries({ queryKey: ROOM_QUERY_KEYS.ALL })`. Mọi query có key bắt đầu bằng `['rooms']` (danh sách, chi tiết…) sẽ được tải lại.
3. **Xoá cache:** đăng xuất thì `resetQueries(AUTH_QUERY_KEYS.ALL)`; xoá media thì `removeQueries(MEDIA_QUERY_KEYS.OBJECT(id))`.

Key phải chứa **mọi thứ làm dữ liệu khác đi** (id, filter, số trang), nếu không trang 2 sẽ dùng nhầm cache của trang 1. Vì vậy key có tham số được viết thành hàm. Mỗi feature khai báo key trong `constants/<tên>.constants.ts`:

```ts
export const ROOM_QUERY_KEYS = {
  ALL: ['rooms'],                                                          // tiền tố chung, để invalidate cả nhóm
  LIST: (params?: ListParams<RoomFilter>) => ['rooms', 'list', params],    // mỗi bộ lọc/trang một cache
  DETAIL: (id: string) => ['rooms', 'detail', id],                         // mỗi phòng một cache
} as const;
```

**Hook** dùng thẳng `useQuery` / `useMutation` của TanStack. Hook mutation nhận `options?: MutationHookOptions<TData, TVariables>` và spread vào sau cấu hình mặc định. Nếu hook tự định nghĩa `onSuccess` thì nhớ gọi lại `options?.onSuccess`:

```ts
export const useRoomsQuery = (params?: ListParams<RoomFilter>) =>
  useQuery({
    queryKey: ROOM_QUERY_KEYS.LIST(params),
    queryFn: () => roomsApi.list(params),
    placeholderData: keepPreviousData, // giữ trang cũ khi chuyển trang
  });

export const useCreateRoomMutation = (
  options?: MutationHookOptions<RoomDetailDto, CreateRoomRequestDto>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: roomsApi.create,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ROOM_QUERY_KEYS.ALL });
      return options?.onSuccess?.(...args);
    },
  });
};
```

## 5. Form

Mỗi form gồm hai file trong `forms/`:

- `xxx.schema.ts`: schema Zod và `XxxFormData = z.infer<...>`. Message lỗi là i18n key dạng `errors.*` (khai báo trong `<TÊN>_VALIDATION_KEYS`).
- `use-xxx-form.ts`: tạo `useForm`, gọi hook mutation, xử lý submit/điều hướng. Hook trả về đúng những gì trang cần: `register`, `errors` (đã dịch, có `serverError`), `isSubmitting`, `handleSubmit`.

Helper dùng chung ở `lib/form.ts`: `getFieldError(error, t)` dịch message của field; `setFormApiErrors(setError, err)` đưa lỗi API vào `root.serverError`. Các input trong `components/ui` dùng `forwardRef`, nên chỉ cần `{...register('field')}`.

## 6. Component

- Component chỉ dùng trong một feature thì đặt ở `features/<tên>/components/`. Chỉ đưa lên `components/` khi có từ hai feature trở lên dùng.
- Biến thể style khai báo bằng hằng `Record<Variant, string>` ở cấp module (xem `button.tsx`) và ghép class bằng `cn()`.

## 7. Checklist thêm feature mới

1. Tạo `features/<tên>/` theo cấu trúc ở mục 1.
2. Chép DTO từ `api-docs` vào `types/<tên>.dto.ts`.
3. Viết `api/<tên>.api.ts` (dùng `http`) và khai báo `<TÊN>_QUERY_KEYS` trong `constants/`.
4. Viết hook query/mutation trong `hooks/`, form trong `forms/`.
5. Thêm bản dịch `apiSuccess` / `apiErrors` cho các mã backend trả về. Nếu là namespace mới thì khai báo thêm trong `API_CODE_NAMESPACES` ở `lib/api/api-messages.ts`.
6. Chạy `npm run build`, `npm run lint`, `npm run i18n:check`.
