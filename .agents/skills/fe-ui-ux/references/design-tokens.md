# Design tokens — Rentify FE

Nguồn sự thật: `@theme` trong [`src/index.css`](../../../../src/index.css). Chỉ dùng class sinh từ các token dưới đây. **Cấm** mã hex trong `className`/`style` (`text-[#021B3D]`, `bg-[#1E6FD9]`…) và màu Tailwind mặc định (`gray-*`, `blue-*`, `red-*`).

Nếu thực sự thiếu một màu, thêm token vào `src/index.css` trong PR riêng và cập nhật bảng này — không viết thẳng mã màu vào component.

## Màu

| Vai trò | Background | Text | Border | Giá trị |
|---|---|---|---|---|
| Nền ứng dụng | `bg-rentify-background` | – | – | `#F8FBFE` |
| Bề mặt card / dialog / popover | `bg-rentify-surface` | – | – | `#FFFFFF` |
| Bề mặt phụ (header bảng, nhóm tab, hover hàng) | `bg-surface-container-low` | – | – | `#F1F3FF` |
| Thương hiệu / hành động chính | `bg-rentify-primary` | `text-rentify-primary` | `border-rentify-primary` | `#1E6FD9` |
| Hover hành động chính | `hover:bg-rentify-primary-hover` | – | – | `#175BB3` |
| Nền nhấn nhẹ (tag, nút secondary, hàng đang chọn) | `bg-rentify-primary-container` | `text-rentify-on-primary-container` | – | `#E8F1FC` |
| Chữ chính (tiêu đề, nội dung) | – | `text-rentify-text-primary` | – | `#142A4C` |
| Chữ phụ (mô tả, nhãn, placeholder) | – | `text-rentify-text-secondary` | – | `#5C7290` |
| Đường kẻ, viền | – | – | `border-rentify-divider` | `#D7E3F2` |
| Thành công / đã duyệt / đã thanh toán | `bg-rentify-success` | `text-rentify-success` | `border-rentify-success` | `#16A34A` |
| Cảnh báo / chờ xử lý | `bg-rentify-warning` | `text-rentify-warning` | `border-rentify-warning` | `#F59E0B` |
| Lỗi / từ chối / nguy hiểm | `bg-rentify-error` | `text-rentify-error` | `border-rentify-error` | `#DC2626` |
| Trung tính / vô hiệu | `bg-rentify-neutral` | `text-rentify-neutral` | `border-rentify-neutral` | `#94A3B8` |

### Màu theo trạng thái nghiệp vụ

Một trạng thái luôn một màu, ở mọi màn hình. Luôn kèm chữ.

| Ý nghĩa | Màu | Ví dụ trạng thái |
|---|---|---|
| Xong, tốt | success | Đã duyệt, Đã thanh toán, Đang thuê, Hợp đồng hiệu lực |
| Cần chú ý, đang chờ | warning | Chờ duyệt, Chưa thanh toán, Sắp hết hạn |
| Hỏng, bị từ chối | error | Bị từ chối, Sự cố khẩn |
| Chưa bắt đầu, không hoạt động | neutral | Phòng trống, Nháp, Đã kết thúc |

Badge trạng thái dùng nền nhạt + chữ đậm cùng tông (xem `Badge`, `StatusDot`), không dùng nền đặc màu đỏ/xanh cho chữ dài.

## Bo góc

| Token | Dùng cho |
|---|---|
| `rounded-sm` (8px) | Input nhỏ, tag |
| `rounded-xl` (12px) | Button, Input, SelectDropdown |
| `rounded-2xl` (16px) | Card, bảng, dialog |
| `rounded-full` | Avatar, badge tròn, status dot |

## Bóng đổ

| Token | Dùng cho |
|---|---|
| `shadow-xs` | Card thường, bảng |
| `shadow-card` | Card nổi nhẹ |
| `shadow-spotlight` | Card nhấn mạnh (CTA, chỉ số chính trên dashboard) |
| `shadow-modal` | Dialog, dropdown |

## Chữ

Font: Inter (đã cấu hình). Thang chữ dùng trong app:

| Vai trò | Class |
|---|---|
| Tiêu đề trang (`h1`) | `text-2xl sm:text-3xl font-bold tracking-tight text-rentify-text-primary` |
| Tiêu đề card (`h2`) | `text-base sm:text-lg font-semibold text-rentify-text-primary` |
| Nội dung | `text-sm text-rentify-text-primary` |
| Mô tả, phụ đề | `text-sm text-rentify-text-secondary` |
| Nhãn phụ, meta, header bảng | `text-xs font-semibold text-rentify-text-secondary` |
| Số liệu lớn (KPI) | `text-2xl font-bold tabular-nums` |

Không dùng chữ < 12px. Nội dung cần đọc kỹ không dùng `text-xs`.

## Khoảng cách

- Giữa các khối lớn của trang: `space-y-6`.
- Trong card: `p-4 sm:p-6`; giữa các phần tử trong card `gap-3`/`gap-4`.
- Giữa các ô form: `gap-4`; nhóm ô liên quan cạnh nhau trên desktop (`sm:grid-cols-2`).
- Theo bội số 4px của Tailwind; không dùng giá trị lẻ `p-[13px]`.
