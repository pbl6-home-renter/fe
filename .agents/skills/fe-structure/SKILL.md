---
name: fe-structure
description: Where files and folders go in the Rentify landlord web (fe/) — feature folders, the pages → forms → hooks → api layers, naming of files, routes per role, navigation config, i18n namespaces, and when to promote code to shared folders. Use before creating, moving or renaming any file in fe/src, when adding a new feature/page/route, or when unsure where a type, constant, hook or component belongs.
license: Apache-2.0
metadata:
  version: "1.0.0"
  category: conventions
  author: Rentify FE
---

# Tổ chức file & thư mục — Rentify FE

Skill này trả lời câu hỏi "file này đặt ở đâu, đặt tên gì". Chi tiết cách viết từng tầng (envelope API, query key, toast, form) nằm ở [`docs/architecture.md`](../../../docs/architecture.md); i18n ở [`docs/i18n-guidelines.md`](../../../docs/i18n-guidelines.md). Đọc hai file đó khi cần viết code của tầng tương ứng.

## Khi nào dùng

- Sắp tạo file/thư mục mới trong `src/`, hoặc thêm feature, trang, route, mục menu.
- Phân vân một type / hằng / hook / component nên nằm trong feature hay ở thư mục dùng chung.
- Review PR có file mới.

## 1. Bản đồ `src/`

```
src/
├── app/            # Khung app: providers, routes/ (theo role), layouts/, trang hệ thống (403/404)
├── components/
│   ├── ui/         # Primitive design system: Button, Input, Dialog, Card, DataTable…
│   ├── feedback/   # Skeleton, EmptyState, ErrorState, AlertBanner, LoadingSpinner…
│   └── guards/     # Ẩn/hiện theo role
├── config/         # Cấu hình tĩnh: navigation.config.ts (menu theo role)
├── hooks/          # Hook generic, KHÔNG biết nghiệp vụ (useDebounce, useDisclosure, useDataTableState)
├── i18n/           # i18next + locales/{vi,en}/<namespace>.json
├── lib/            # api/ (client, http, errors), query/, utils/ (cn, format), form.ts
├── stores/         # Zustand — chỉ state toàn cục thật sự (auth)
├── types/          # Type mà phần dùng chung cần: api.ts, user.ts, role.ts
└── features/<feature>/
```

## 2. Bên trong một feature

Tên feature là danh từ số nhiều, kebab-case, khớp tài nguyên API: `buildings`, `rooms`, `contracts`, `invoices`, `meter-readings`.

```
features/rooms/
├── api/rooms.api.ts                 # HTTP thuần qua `http`, không React
├── constants/rooms.constants.ts     # ROOM_QUERY_KEYS, hằng nghiệp vụ, VALIDATION_KEYS
├── enums/room-status.enum.ts        # const object + type cùng tên (không dùng TS enum)
├── types/rooms.dto.ts               # DTO chép từ api-docs (request/response/filter)
├── hooks/
│   ├── use-rooms-query.ts           # 1 query/mutation = 1 file
│   ├── use-create-room-mutation.ts
│   └── use-room-list.ts             # hook "màn hình": gom state + query cho 1 trang/khối UI
├── forms/
│   ├── room.schema.ts               # Zod schema + RoomFormData = z.infer<…>
│   └── use-room-form.ts             # useForm + mutation + điều hướng
├── components/                      # Component chỉ feature này dùng
│   ├── room-list-table.tsx
│   ├── room-list-columns.tsx
│   └── admin/                       # Nhóm theo role khi feature phục vụ nhiều role
├── pages/
│   ├── room-list-page.tsx
│   └── admin/
└── utils/                           # Hàm thuần của riêng feature
```

Chỉ tạo thư mục khi có file đầu tiên cần nó. Không tạo thư mục rỗng "để sẵn".

**Luồng phụ thuộc (một chiều):**

```
pages/ → components/ → forms/ → hooks/ → api/
                    ↘ hooks/ (trang không có form gọi thẳng hook)
```

- `api/` không import React, hook, store.
- `components/` không gọi `api/` trực tiếp, luôn đi qua hook.
- Feature không gọi `apiClient`/`axios`; dùng `http` từ `@/lib/api/http`.

## 3. Đặt tên file

| Loại | Mẫu | Ví dụ |
|---|---|---|
| Component / page | `kebab-case.tsx`, export `PascalCase` | `building-detail-page.tsx` → `BuildingDetailPage` |
| Hook | `use-<noun>-<verb/role>.ts` | `use-my-buildings-query.ts`, `use-delete-building-mutation.ts`, `use-building-list.ts` |
| API | `<feature>.api.ts`, export object `<feature>Api` | `building.api.ts` → `buildingApi` |
| Schema form | `<noun>.schema.ts` | `building.schema.ts` |
| Hook form | `use-<noun>-form.ts` | `use-building-edit-form.ts` |
| DTO | `<feature>.dto.ts` | `building.dto.ts` |
| Hằng | `<feature>.constants.ts`, hằng `UPPER_SNAKE` | `BUILDING_QUERY_KEYS` |
| Enum | `<noun>.enum.ts` | `building-status.enum.ts` |
| Route theo role | `app/routes/roles/<role>.routes.tsx` | `landlord.routes.tsx` |

Tên file luôn kebab-case, tiếng Anh. Không đặt `index.ts` (barrel), không đặt tên chung chung như `utils.ts`, `helpers.ts`, `common.tsx` trong feature — đặt theo việc nó làm (`format-building-address.ts`).

## 4. Cái này đặt ở đâu?

| Bạn có… | Đặt ở |
|---|---|
| DTO/type chỉ 1 feature dùng | `features/<f>/types/<f>.dto.ts` |
| Type mà feature thứ 2 bắt đầu cần | Chuyển lên `src/types/`. Không import chéo `features/A/types` từ feature B |
| Kiểu dữ liệu form | `z.infer` ngay trong `forms/<noun>.schema.ts` |
| Component 1 feature dùng | `features/<f>/components/` |
| Component ≥ 2 feature dùng, không biết nghiệp vụ | `components/ui/` (primitive) hoặc `components/feedback/` (trạng thái) |
| Component ≥ 2 feature dùng, có nghiệp vụ (vd chọn tỉnh/phường) | Feature riêng sở hữu nó (`features/administrative-units/components/`), feature khác import qua `@/features/...` |
| Hook generic (không biết API nào) | `src/hooks/` |
| Hook gọi API / chứa nghiệp vụ | `features/<f>/hooks/` |
| Hàm format tiền, ngày | Đã có trong `lib/utils/format.ts` (`formatVnd`, `formatDate`, `formatDateTime`, `formatMonth`). Thêm vào đó nếu là format chung |
| Text hiển thị | `i18n/locales/{vi,en}/<namespace>.json` — không bao giờ trong code |
| Mục menu sidebar | `config/navigation.config.ts` (dùng `titleKey`, không text) |
| Route mới | File role tương ứng trong `app/routes/roles/`, bọc `ProtectedRoute allowedRoles` |
| State toàn cục | Gần như không bao giờ. Server state → TanStack Query; state màn hình → hook / URL; chỉ auth ở Zustand |

## 5. Route, menu, namespace

- **Route:** ưu tiên ít route. Tạo/sửa mở bằng `Dialog` từ trang danh sách/chi tiết thay vì `/x/new`, `/x/:id/edit`. Route mới chỉ khi màn hình cần URL riêng để chia sẻ/bookmark (danh sách, chi tiết).
- **Đường dẫn:** số nhiều, kebab-case, khớp feature: `/buildings`, `/buildings/:id`, `/meter-readings`. Trang admin dưới `/admin/...`.
- **Namespace i18n:** mỗi feature lớn một namespace trùng tên feature (`buildings.json`), khai báo trong `src/i18n/i18n.d.ts` và `API_CODE_NAMESPACES` nếu backend trả mã của feature đó. Text dùng nhiều nơi (Lưu, Huỷ, phân trang) ở `common`.

## 6. Giới hạn kích thước

- File `.tsx` ≤ 200 dòng. Vượt thì tách sub-component theo khối giao diện (Header, OverviewCard, …) trong `components/`.
- File `.tsx` chủ yếu là JSX. Logic (query, memo, handler, tính toán options) tách sang hook `use-<component>.ts` trong `hooks/`.
- Danh sách cột của bảng tách ra `<noun>-list-columns.tsx`; card mobile tách ra `<noun>-list-mobile-row.tsx`.

## Checklist khi thêm file

- [ ] Tên kebab-case, đúng mẫu ở mục 3, không `index.ts`.
- [ ] Nằm đúng tầng; không import ngược chiều (component → api, lib → features…).
- [ ] Không có type/hằng/hàm trùng với thứ đã có (`grep` trước khi viết mới).
- [ ] Text mới có ở cả `vi` và `en`.
- [ ] Không có file/thư mục/export chưa ai dùng.
