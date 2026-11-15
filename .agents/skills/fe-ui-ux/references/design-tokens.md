# Design tokens — Rentify FE

Nguồn sự thật: `@theme` trong [`src/index.css`](../../../../src/index.css). Chỉ dùng class sinh từ các token dưới đây. **Cấm** mã hex trong `className`/`style` và màu Tailwind mặc định (`gray-*`, `blue-*`, `red-*`).

Nếu thực sự thiếu một màu, thêm token vào `src/index.css` trong PR riêng và cập nhật bảng này — không viết thẳng mã màu vào component.

## 1. Hệ màu nền tảng (Global Color Palette)

### A. Màu thương hiệu & Chủ đạo (Brand & Primary - Indigo)

| Vai trò                                       | Background                                                  | Text                                                              | Border                                      | Giá trị                                             |
| --------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------- |
| Primary Button, link chính, nhận diện         | `bg-primary` / `bg-rentify-primary`                         | `text-primary` / `text-rentify-primary`                           | `border-primary` / `border-rentify-primary` | `#4F46E5`                                           |
| Hover Primary                                 | `hover:bg-primary-hover` / `hover:bg-rentify-primary-hover` | –                                                                 | –                                           | `#4338CA`                                           |
| Primary Container (Vùng chọn, active tab)     | `bg-primary-container` / `bg-rentify-primary-container`     | `text-on-primary-container` / `text-rentify-on-primary-container` | –                                           | `#EEF2FF`                                           |
| Chữ/icon trên nền Primary                     | –                                                           | `text-on-primary` / `text-rentify-on-primary`                     | –                                           | `#FFFFFF`                                           |
| Primary Gradient (Banner, Onboarding, Header) | `.bg-primary-gradient`                                      | –                                                                 | –                                           | `linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)` |

### B. Màu phụ trợ 1 – Xanh ngọc (Teal - Nhấn mạnh tài chính & vận hành)

| Vai trò                                                      | Background          | Text                | Border                | Giá trị                                             |
| ------------------------------------------------------------ | ------------------- | ------------------- | --------------------- | --------------------------------------------------- |
| Teal Primary (Giá tiền phòng, thao tác phụ, link xem tất cả) | `bg-teal-primary`   | `text-teal-primary` | `border-teal-primary` | `#006876`                                           |
| Teal Accent (Thanh tiến độ hợp đồng, gradient phụ)           | `bg-teal-accent`    | `text-teal-accent`  | `border-teal-accent`  | `#008394`                                           |
| Teal Surface (Nền thẻ/dải đầu card phòng, hợp đồng)          | `bg-teal-surface`   | –                   | –                     | `#F2FBFD`                                           |
| Teal Border (Viền nút hành động xanh ngọc)                   | –                   | –                   | `border-teal-border`  | `#E1F3F6`                                           |
| Teal Gradient                                                | `.bg-teal-gradient` | –                   | –                     | `linear-gradient(135deg, #006876 0%, #008394 100%)` |

### C. Màu phụ trợ 2 – Xanh xám Slate (Slate - Nền trung tính cao cấp)

| Vai trò                                                      | Background         | Text                 | Border                | Giá trị   |
| ------------------------------------------------------------ | ------------------ | -------------------- | --------------------- | --------- |
| Slate Darkest (Tiêu đề chính không gắt mắt)                  | –                  | `text-slate-darkest` | –                     | `#161B2C` |
| Slate Medium (Chữ cấp 2, icon chức năng phụ)                 | –                  | `text-slate-medium`  | –                     | `#595E72` |
| Slate Border (Viền thẻ card tông lạnh)                       | –                  | –                    | `border-slate-border` | `#DDE1F9` |
| Slate Surface (Nền huy hiệu tròn, icon badge, tag phân loại) | `bg-slate-surface` | –                    | –                     | `#EEF0FF` |

### D. Màu Trung tính & Bề mặt (Neutrals & Surfaces)

| Vai trò                                 | Background                                                      | Text                                                  | Border                                      | Giá trị   |
| --------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------- | --------- |
| Nền toàn bộ trang web (Page Background) | `bg-page-background` / `bg-rentify-background`                  | –                                                     | –                                           | `#F8FAFC` |
| Bề mặt card, modal, dialog, search      | `bg-card-surface` / `bg-rentify-surface`                        | –                                                     | –                                           | `#FFFFFF` |
| Bề mặt phụ (header bảng, hover hàng)    | `bg-surface-container-low` / `bg-rentify-surface-container-low` | –                                                     | –                                           | `#F8FAFC` |
| Chữ chính (độ tương phản cao WCAG AAA)  | –                                                               | `text-text-primary` / `text-rentify-text-primary`     | –                                           | `#0F172A` |
| Chữ phụ, hướng dẫn                      | –                                                               | `text-text-secondary` / `text-rentify-text-secondary` | –                                           | `#475569` |
| Chữ mờ, placeholder (WCAG AA > 4.5:1)   | –                                                               | `text-text-muted` / `text-rentify-text-muted`         | –                                           | `#64748B` |
| Viền phân cách mặc định, đường kẻ       | –                                                               | –                                                     | `border-divider` / `border-rentify-divider` | `#E2E8F0` |

### E. Màu Trạng thái nghiệp vụ (Semantic / Status Colors)

| Ý nghĩa                          | Background                          | Text                                    | Border           | Giá trị   | Ví dụ trạng thái                                          |
| -------------------------------- | ----------------------------------- | --------------------------------------- | ---------------- | --------- | --------------------------------------------------------- |
| Thành công (Success)             | `bg-success` / `bg-rentify-success` | `text-success` / `text-rentify-success` | `border-success` | `#16A34A` | Hóa đơn đã trả, hợp đồng hiệu lực, trạng thái mở          |
| Cảnh báo (Warning)               | `bg-warning` / `bg-rentify-warning` | `text-warning` / `text-rentify-warning` | `border-warning` | `#F59E0B` | Sắp đến hạn đóng tiền, chờ duyệt, hồ sơ đang ẩn           |
| Nguy hiểm / Lỗi (Error / Danger) | `bg-error` / `bg-rentify-error`     | `text-error` / `text-rentify-error`     | `border-error`   | `#DC2626` | Quá hạn thanh toán, báo cáo sự cố, chấm badge đỏ, nút xóa |
| Trung tính / Đã đóng             | `bg-neutral` / `bg-rentify-neutral` | `text-neutral` / `text-rentify-neutral` | `border-neutral` | `#64748B` | Phòng trống, Nháp, Đã kết thúc                            |

## 2. Bo góc (Radius Scale)

| Token                              | Dùng cho                       |
| ---------------------------------- | ------------------------------ |
| `rounded-xs` (4px)                 | Tag siêu nhỏ, chỉ số phụ       |
| `rounded-sm` (8px)                 | Tag, badge                     |
| `rounded-md` / `rounded-xl` (12px) | Button, Input, SelectDropdown  |
| `rounded-2xl` (16px)               | Card, bảng, dialog             |
| `rounded-full`                     | Avatar, badge tròn, status dot |

## 3. Bóng đổ (Shadow Scale)

| Token              | Dùng cho                                          |
| ------------------ | ------------------------------------------------- |
| `shadow-xs`        | Card thường, badge nổi nhẹ                        |
| `shadow-card`      | Card bề mặt chuẩn, input focus                    |
| `shadow-spotlight` | Card nhấn mạnh (CTA, chỉ số chính trên dashboard) |
| `shadow-modal`     | Dialog, popover, dropdown menu                    |

## 4. Chữ (Typography)

Font Family duy nhất: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif`.

| Vai trò                     | Class                                                                     |
| --------------------------- | ------------------------------------------------------------------------- |
| Tiêu đề trang (`h1`)        | `text-2xl sm:text-3xl font-bold tracking-tight text-rentify-text-primary` |
| Tiêu đề card (`h2`)         | `text-base sm:text-lg font-semibold text-rentify-text-primary`            |
| Nội dung                    | `text-sm text-rentify-text-primary`                                       |
| Mô tả, phụ đề               | `text-sm text-rentify-text-secondary`                                     |
| Nhãn phụ, meta, header bảng | `text-xs font-semibold text-rentify-text-secondary`                       |
| Số liệu lớn (KPI)           | `text-2xl font-bold tabular-nums`                                         |

Tuyệt đối không dùng chữ < 12px (`text-[11px]`). Nội dung cần đọc kỹ không dùng `text-xs`.

## 5. Hệ thống Khoảng cách (Spacing Grid – Bội số 4px)

Tuyệt đối không dùng các khoảng cách lẻ (như 7px, 11px, 15px). Toàn bộ layout tuân theo nhịp 4px:

- `4px` (`gap-1`, `p-1`)
- `8px` (`gap-2`, `p-2`)
- `12px` (`gap-3`, `p-3`)
- `16px` (`gap-4`, `p-4`)
- `20px` (`gap-5`, `p-5`)
- `24px` (`gap-6`, `p-6`)
- `32px` (`gap-8`, `p-8`)
- `48px` (`gap-12`, `p-12`)
- `64px` (`gap-16`, `p-16`)

**Quy chuẩn áp dụng:**

- Padding trong thẻ card: `16px` (`p-4`) hoặc `20px` (`p-5`).
- Khoảng cách giữa các khối lớn: `24px` (`space-y-6`) hoặc `32px` (`space-y-8`).

## 6. Iconography (Phong cách Icon dùng chung)

- Nét vẽ viền mảnh (Stroke): 1.5px đến 2.0px (mặc định cấu hình `stroke-width: 1.75px` cho `svg.lucide`).
- Đầu nét và góc vẽ: Bo tròn mềm mại (`stroke-linecap: round; stroke-linejoin: round`).

## 7. Quy chuẩn Định dạng Dữ liệu hiển thị (Data Formatting)

- **Tiền tệ (VND):** Luôn phân cách hàng nghìn bằng dấu chấm `.`, có khoảng trắng trước chữ `đ` (hoặc `đ/tháng`). Chuẩn: `1.800.000 đ` hoặc `1.800.000 đ/tháng` (`formatVnd`). Không viết: `1,800,000VND` hay `1800000d`.
- **Ngày tháng:** Định dạng chuẩn Việt Nam `dd/MM/yyyy` (Ví dụ: `15/11/2026`) (`formatDate`).
- **Diện tích:** Luôn có dấu cách trước đơn vị `m²` (Ví dụ: `20 m²`).
- Theo bội số 4px của Tailwind; không dùng giá trị lẻ `p-[13px]`.
