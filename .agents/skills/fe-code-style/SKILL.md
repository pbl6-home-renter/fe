---
name: fe-code-style
description: Code style for the Rentify landlord web (fe/) — TypeScript, React components and hooks, TanStack Query, react-hook-form + zod, Tailwind with design tokens, URL/table state, error handling and comments. Use whenever writing, refactoring or reviewing .ts/.tsx code in fe/src, so new code reads like the existing code and avoids the bugs found in past reviews.
license: Apache-2.0
metadata:
  version: "1.0.0"
  category: conventions
  author: Rentify FE
---

# Code style — Rentify FE

Mục tiêu: người đọc mở file nào cũng thấy cùng một kiểu viết. Khi quy tắc dưới đây chưa nói tới, **bắt chước file gần nhất cùng loại** (vd viết mutation mới thì mở `use-delete-building-mutation.ts`).

Vị trí file: xem skill `fe-structure`. Mẫu chi tiết của từng tầng: [`docs/architecture.md`](../../../docs/architecture.md).

## 1. Định dạng

- 2 dấu cách, nháy đơn, có dấu chấm phẩy, trailing comma ở mảng/object/tham số nhiều dòng.
- Hook `lint-staged` chạy `eslint --fix` khi commit; vẫn tự chạy `npm run lint` trước khi đẩy.
- Import theo thứ tự: thư viện ngoài → `@/…` → đường dẫn tương đối. Dùng `import type` cho import chỉ có type.
- Trong cùng feature dùng đường dẫn tương đối (`../hooks/…`); từ ngoài vào dùng alias `@/features/…`.

## 2. TypeScript

- `strict` đang bật, `noUnusedLocals/Parameters` bật. Không `any`; dữ liệu chưa rõ dùng `unknown` rồi thu hẹp.
- Không dùng `enum` của TS. Dùng const object + type cùng tên (mẫu `building-status.enum.ts`):
  ```ts
  export const BuildingStatus = { PENDING: 'pending', APPROVED: 'approved' } as const;
  export type BuildingStatus = (typeof BuildingStatus)[keyof typeof BuildingStatus];
  ```
- `interface` cho props và DTO; `type` cho union/ánh xạ. Props đặt tên `<Component>Props`.
- Hạn chế `as`. Giá trị đến từ ngoài (URL, localStorage, API không chắc chắn) phải **kiểm tra** rồi mới ép kiểu:
  ```ts
  const STATUS_VALUES: string[] = Object.values(BuildingStatus);
  const status = STATUS_VALUES.includes(raw) ? (raw as BuildingStatus) : undefined;
  ```
- DTO chép đúng tên field từ `api-docs` (camelCase); không đổi tên ở FE.

## 3. React component

- Function component dạng `export const Xxx = (props) => …`, **named export**. Không default export.
- File `.tsx` là giao diện: gọi một hook, destructure, trả JSX. Logic quá vài dòng → `hooks/use-<component>.ts`.
- Map biến thể style bằng `Record<Variant, string>` ở cấp module, ghép class bằng `cn()` (mẫu `button.tsx`).
- Dùng primitive có sẵn trong `components/ui` và `components/feedback` (Button, IconButton, Input, NumberInput, Textarea, SelectDropdown, Checkbox, Dialog, Card, Badge, StatusDot, DataTable, Skeleton, EmptyState, ErrorState, AlertBanner). Không tự dựng `<button>`, `<input>`, modal `fixed inset-0` thô.
- Hàm render danh sách cần `key` ổn định (id), không dùng index trừ skeleton.
- Không `useEffect` để tính dữ liệu suy ra được từ props/state — tính trực tiếp hoặc `useMemo`. `useEffect` chỉ cho đồng bộ với bên ngoài (DOM, storage, URL, reset form khi dữ liệu về).

## 4. Hook & tham chiếu ổn định

- Giá trị mặc định dạng object/mảng (`= {}`, `= []`) tạo object mới mỗi render và phá `useMemo`/`useCallback`. Khai báo hằng ở cấp module:
  ```ts
  const DEFAULT_FILTERS = { status: 'all' };   // ✅ module level
  useDataTableState({ defaultFilters: DEFAULT_FILTERS });
  // ❌ useDataTableState({ defaultFilters: { status: 'all' } })
  ```
- Object trả về được truyền xuống làm props/state của thư viện (TanStack Table, context) thì bọc `useMemo`/`useCallback`.
- Hook trả về **đúng thứ màn hình cần** (`tableProps`, `metrics`, `handleSubmit`, `isSubmitting`), không trả nguyên `query`/`form` nếu không cần.

## 5. Gọi API & server state

- Mọi dữ liệu server qua TanStack Query; không lưu bản sao vào `useState`/Zustand.
- Query key từ `<FEATURE>_QUERY_KEYS`, chứa mọi tham số làm dữ liệu khác đi (id, filter, trang). Danh sách dùng `placeholderData: keepPreviousData`.
- Mutation nhận `options?: MutationHookOptions`, spread sau cấu hình mặc định, và gọi lại `options?.onSuccess` nếu tự định nghĩa `onSuccess`. Invalidate theo `ALL` của feature.
- **Không** `try/catch` để `console.error` hay tự `toast.error` lỗi API — interceptor đã toast. Lỗi 422 của form: `setFormApiErrors(form.setError, error)`.
- Không bịa số liệu: chỉ hiển thị field có trong DTO. Tính năng chưa có API thì chưa làm UI.

## 6. Form

- Schema Zod trong `forms/<noun>.schema.ts`; message lỗi là i18n key (`errors.*`), dịch bằng `getFieldError`.
- `useForm({ resolver: zodResolver(schema), mode: 'onTouched' })` — báo lỗi khi rời ô, không báo khi đang gõ lần đầu.
- Trim chuỗi **khi tạo payload**, không trim giá trị đang hiển thị trong input.
- Form sửa: chỉ gửi field đã thay đổi; không có gì đổi thì báo `messages.noChanges` và đóng.
- Nút submit dùng `isLoading={isSubmitting}`; không cho submit 2 lần.

## 7. State trên URL (danh sách, bộ lọc)

- Trang, kích thước trang, sắp xếp, bộ lọc, từ khoá tìm kiếm nằm trên URL (dùng `useDataTableState`) để F5/chia sẻ link không mất.
- Mọi giá trị đọc từ URL phải validate: số nguyên dương, nằm trong whitelist (pageSize, sort, status). Sai thì về mặc định, **không** gửi lên API.
- Ô tìm kiếm bind giá trị thô; debounce (`useDebounce`) và `trim()` ở chỗ gọi API.
- Trang vượt quá tổng số trang thì kéo về trang cuối có dữ liệu (DataTable đã làm).
- Gõ tìm kiếm dùng `replace` history; đổi trang/bộ lọc dùng push.

## 8. Tương tác & sự kiện

- Phần tử click được nhưng không phải `<button>` (hàng bảng, card) phải có `tabIndex={0}`, xử lý Enter/Space, và **bỏ qua sự kiện nổi bọt từ control con**:
  ```ts
  if (event.target !== event.currentTarget) return;
  ```
- Nút/checkbox trong hàng click được: `onClick={(e) => e.stopPropagation()}`.
- `localStorage`/`sessionStorage`: luôn bọc `try/catch` cả đọc lẫn ghi; app phải chạy được khi storage bị chặn.

## 9. Style (Tailwind)

- Chỉ dùng token trong `src/index.css` (`bg-rentify-surface`, `text-rentify-text-primary`, `border-rentify-divider`, `text-rentify-success`…). **Không** viết mã hex hay `text-[#…]`, không dùng màu Tailwind mặc định (`text-gray-500`, `bg-blue-600`).
- Bo góc, bóng đổ: dùng scale có sẵn (`rounded-xl`, `rounded-2xl`, `shadow-xs`, `shadow-card`).
- Số tiền, chỉ số công tơ, số đếm trong bảng: thêm `tabular-nums`.
- Responsive mobile-first: class gốc cho màn nhỏ, `sm:`/`md:`/`lg:` mở rộng.

## 10. Comment & tên

- Code, tên biến, comment bằng tiếng Anh. Text người dùng thấy luôn qua i18n.
- Comment chỉ giải thích **vì sao** (ràng buộc API, lý do workaround), không kể lại code làm gì. Một hai dòng là đủ.
- Tên boolean: `isLoading`, `hasDocuments`, `canEdit`. Handler: `handleXxx` trong component, prop callback `onXxx`.
- Không để code chết: export, prop, dependency, file chưa ai dùng thì xoá. Không thêm tính năng "để sẵn sau này".

## Checklist trước khi commit

- [ ] `npm run build`, `npm run lint`, `npm run i18n:check` đều sạch.
- [ ] Không hex, không text hardcode, không `any`, không `index.ts`.
- [ ] Giá trị từ URL/storage đã validate; storage có `try/catch`.
- [ ] Default object/mảng là hằng module; state truyền cho thư viện đã memo.
- [ ] Không `try/catch` + toast lỗi API thủ công.
- [ ] Không còn export/prop/dependency thừa.
- [ ] Không viết file `*.test.ts`.
