# Rentify Frontend — Agent Development Guidelines & Best Practices

Tài liệu này là quy chuẩn bắt buộc cho mọi AI Agent hoặc developer khi tham gia phát triển, refactor hoặc bảo trì codebase trong `fe/`. Mọi thay đổi code PHẢI tuân thủ nghiêm ngặt các quy tắc dưới đây.

---

## 1. Hệ Thống Design Tokens & Bảng Màu (Design System & Color Tokens)

### ⛔ CẤM TUYỆT ĐỐI (STRICTLY FORBIDDEN):
- **Không bao giờ viết mã màu hex trực tiếp** trong `className` hay `style` (ví dụ: `text-[#021B3D]`, `bg-[#1E6FD9]`, `border-[#D7E3F2]`, `#5C7290`, v.v.).
- Tất cả màu sắc và style của ứng dụng đã được định nghĩa chuẩn hóa trong `src/index.css` thông qua Tailwind v4 `@theme`.

### ✅ BẢNG TOKEN CHUẨN ĐƯỢC PHÉP SỬ DỤNG:

| Vai trò / Ý nghĩa | Class Background | Class Text | Class Border | Token Variable |
|---|---|---|---|---|
| **Nền ứng dụng (App Canvas)** | `bg-rentify-background` | - | - | `--color-rentify-background` (`#F8FBFE`) |
| **Bề mặt Card / Modal / Popover** | `bg-rentify-surface` | - | - | `--color-rentify-surface` (`#FFFFFF`) |
| **Bề mặt phụ (Container Low)** | `bg-surface-container-low` | - | - | `--color-surface-container-low` (`#F1F3FF`) |
| **Màu thương hiệu chính (Primary Brand)** | `bg-rentify-primary` | `text-rentify-primary` | `border-rentify-primary` | `--color-rentify-primary` (`#1E6FD9`) |
| **Hover nút chính** | `hover:bg-rentify-primary-hover` | - | - | `--color-rentify-primary-hover` (`#175BB3`) |
| **Container nút / tag phụ (Light Blue)** | `bg-rentify-primary-container` | `text-rentify-on-primary-container` | - | `--color-rentify-primary-container` (`#E8F1FC`) |
| **Chữ tiêu đề / nội dung chính** | - | `text-rentify-text-primary` | - | `--color-rentify-text-primary` (`#142A4C`) |
| **Chữ phụ / mô tả / placeholder / nhãn** | - | `text-rentify-text-secondary` | - | `--color-rentify-text-secondary` (`#5C7290`) |
| **Đường kẻ viền (Dividers & Borders)** | - | - | `border-rentify-divider` | `--color-rentify-divider` (`#D7E3F2`) |
| **Trạng thái Thành công (Success / Active)** | `bg-rentify-success` | `text-rentify-success` | `border-rentify-success` | `--color-rentify-success` (`#16A34A`) |
| **Trạng thái Thất bại / Lỗi (Error / Danger)** | `bg-rentify-error` | `text-rentify-error` | `border-rentify-error` | `--color-rentify-error` (`#DC2626`) |
| **Trạng thái Cảnh báo (Warning / Pending)** | `bg-rentify-warning` | `text-rentify-warning` | `border-rentify-warning` | `--color-rentify-warning` (`#F59E0B`) |
| **Trạng thái Trung tính (Neutral / Disabled)** | `bg-rentify-neutral` | `text-rentify-neutral` | `border-rentify-neutral` | `--color-rentify-neutral` (`#94A3B8`) |

---

## 2. Ưu Tiên Sử Dụng Built-in UI Components

### ⛔ CẤM:
- Tự chế component bằng thẻ HTML thô (`<div role="dialog">`, `<input type="checkbox">`, `<button>` thô) khi dự án đã có sẵn primitive component trong `@/components/ui/`.
- Tự viết modal bằng `div fixed inset-0` thay vì dùng `<Dialog>`.
- Tự viết card bằng `div bg-white rounded shadow` thay vì dùng `<Card>`.

### ✅ DANH SÁCH COMPONENT CÓ SẴN (Trong `@/components/ui/`):
- **Card**: `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>`, `<CardFooter>` (`@/components/ui/card`)
- **Dialog / Modal**: `<Dialog>`, `<DialogContent>`, `<DialogHeader>`, `<DialogTitle>`, `<DialogDescription>`, `<DialogFooter>` (`@/components/ui/dialog`)
- **Button**: `<Button variant="primary | secondary | outline | ghost | danger" size="sm | md | lg" isLoading={...}>` (`@/components/ui/button`)
- **Icon Button**: `<IconButton variant="..." size="...">` (`@/components/ui/icon-button`)
- **Input & Password**: `<Input>`, `<PasswordInput>` (`@/components/ui/input`, `@/components/ui/password-input`)
- **Checkbox**: `<Checkbox checked={...} onCheckedChange={...}>` (`@/components/ui/checkbox`)
- **Avatar**: `<Avatar>`, `<AvatarImage>`, `<AvatarFallback>` (`@/components/ui/avatar`)
- **Badge**: `<Badge variant="...">` (`@/components/ui/badge`)
- **Dropdown / Select**: `<SelectDropdown>` (`@/components/ui/select-dropdown`)
- **Logo**: `<RentifyLogo>` (`@/components/ui/rentify-logo`)
- **Divider**: `<Divider>` (`@/components/ui/divider`)
- **Feedback & States**: `<LoadingSpinner>`, `<LoadingOverlay>`, `<EmptyState>`, `<ErrorState>`, `<AlertBanner>` (`@/components/feedback/*`)

---

## 3. Quy Chuẩn Đa Ngôn Ngữ (i18n Standards)

### ⛔ CẤM:
- **Không hardcode bất kỳ chuỗi hiển thị nào** (tiếng Việt hay tiếng Anh) trực tiếp trong JSX hoặc trong code thông báo.
- **Không gọi `i18n.t(...)` trong các file static constants / config**. Lý do: Chuỗi sẽ bị đóng cứng tại thời điểm import và không tự động cập nhật khi người dùng thay đổi ngôn ngữ.

### ✅ NGUYÊN TẮC:
1. **Dùng hook `useTranslation(namespace)`**:
   - `const { t } = useTranslation();` -> mặc định dùng `common`.
   - `const { t } = useTranslation('auth');` -> phân hệ auth.
   - `const { t } = useTranslation('buildings');` -> phân hệ tòa nhà.
   - `const { t } = useTranslation('dashboard');` -> phân hệ dashboard.
2. **Quy tắc lưu key trong Constants**:
   - Khai báo trường `titleKey`, `labelKey`, `descKey` thay vì lưu chuỗi text:
     ```ts
     export const NAV_ITEMS = [{ titleKey: 'navigation.overview', path: '/dashboard' }];
     // Trong component:
     <span>{t(item.titleKey)}</span>
     ```
3. **Đồng bộ song ngữ bắt buộc**:
   - Khi thêm bất kỳ key mới nào vào `src/i18n/locales/vi/<ns>.json`, PHẢI đồng thời thêm vào `src/i18n/locales/en/<ns>.json`.
   - Khai báo namespace mới trong `src/i18n/i18n.d.ts` để đảm bảo IDE hỗ trợ type-safety và autocomplete.
   - Sử dụng định dạng **camelCase** cho cả object key và leaf key (ví dụ: `submitButton`, `breadcrumbCurrent`).

---

## 4. Xử Lý Lỗi (Error Handling) & Toast Notifications

### ⛔ CẤM:
- Không bọc các hàm gọi API / submit form trong khối `try/catch` vô nghĩa chỉ để `console.error` hoặc cố tự `toast.error()`.
- Không tự hiển thị toast thông báo lỗi API trong components hoặc feature hooks.

### ✅ CƠ CHẾ HOẠT ĐỘNG:
- **Axios Interceptor** tại `src/lib/api/client.ts` đã tự động bắt lỗi từ backend, trích xuất mã lỗi `code`, tra cứu bản dịch thông qua `api-messages.ts` và tự động hiển thị `toast.error()`.
- Tương tự, các response thành công có mang thông điệp `code` cũng được interceptor tự động hiển thị `toast.success()`.
- Việc của Form / Component là:
  - Hiển thị trạng thái `isLoading` / `isSubmitting`.
  - Gắn lỗi validation từng trường (field errors) vào form bằng helper `setFormApiErrors(form.setError, error)` nếu có lỗi 422 từ backend.
  - Điều hướng màn hình (navigation) hoặc reset form khi thành công trong callback `onSuccess` của mutation.

---

## 5. Quy Tắc Kiến Trúc & Tổ Chức File (Architecture Rules)

### 3 Tầng Kiến Trúc Bắt Buộc (Xem `docs/architecture.md`):
```
pages/ ──► forms/use-xxx-form.ts (Zod validation, UI state, navigation)
                 │
                 ▼
          hooks/use-xxx-mutation.ts / use-xxx-query.ts (TanStack Query, cache, store sync)
                 │
                 ▼
          api/xxx.api.ts (HTTP thuần với http.get/post/put/delete)
```

### Tiêu Chuẩn Clean Code:
1. **Tách biệt Triệt để Logic và Giao diện trong file `.tsx` (Separation of Logic & UI)**:
   - File `.tsx` sinh ra để render HTML/JSX. Khi mở một file `.tsx`, developer phải thấy ngay giao diện và cấu trúc component, **không phải lướt qua hàng chục dòng logic, queries, hay memos**.
   - Bất kỳ component nào có logic quản lý trạng thái, tính toán options, gọi queries hoặc xử lý handlers phức tạp **bắt buộc phải tách ra custom hook riêng** (ví dụ: `use-<component-name>.ts` đặt trong thư mục `hooks/`).
   - Component `.tsx` chỉ gọi custom hook đó, destructure các giá trị cần thiết và return JSX layout sạch sẽ, trực quan.
2. **Không tạo file "quái vật" (Giant Files)**:
   - Các file component/page **không được vượt quá 200 dòng**.
   - Nếu màn hình phức tạp, bắt buộc chia nhỏ thành các sub-components đặt trong thư mục `components/` của feature đó (ví dụ: chia thành Header, DetailsCard, OverviewCard, Sidebar, v.v.).
3. **Không dùng file `index.ts` (Barrel Files)**:
   - Import trực tiếp từ file đích (ví dụ: `import { Button } from '@/components/ui/button';`).
4. **Đồng bộ State & UX Giữa Các Màn Hình**:
   - Cùng một nghiệp vụ (ví dụ: Tạo tòa nhà và Sửa tòa nhà) phải sử dụng cấu trúc tương đồng, dùng chung schema validation và hook xử lý khi có thể, tránh tình trạng mỗi màn hình viết một kiểu rời rạc.
5. **Quy Chuẩn Điều Hướng vs Modal/Drawer khi Tạo & Chỉnh Sửa (Create/Edit Flow Standards)**:
   - Hạn chế tạo các route con vụn vặt như `/buildings/new`, `/buildings/:id/edit` nếu luồng thao tác có thể mở trực tiếp từ Dashboard hoặc màn hình danh sách/chi tiết thông qua `<Dialog>` hoặc Slide-over Drawer.
   - Giữ nguyên ngữ cảnh (context preservation) cho người dùng, tránh phải reload hoặc redirect trang không cần thiết và giữ bảng định tuyến (routing table) tinh gọn, nhất quán.
6. **Nguyên Tắc "Dữ Liệu Thật Từ API" (Truthful Data First — Không Bịa Mock Data)**:
   - **Nghiêm cấm tự bịa hoặc hardcode số liệu mock trên UI**: Không tự tính toán số liệu giả lập (ví dụ: tự nhân tiền phòng để tạo doanh thu ước tính, tự chế mã định danh bằng `id.slice(-6)`, vẽ biểu đồ doanh thu giả hay sơ đồ phòng giả).
   - Chỉ hiển thị những thông tin, trường dữ liệu đã có trong API DTO thực tế. Những tính năng chưa có API ở backend thì **không làm trước / không vẽ mock data** để tránh gây nhầm lẫn nghiệp vụ và sai lệch logic hệ thống.
