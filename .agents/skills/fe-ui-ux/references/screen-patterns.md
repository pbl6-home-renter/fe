# Khung màn hình — Rentify FE

Màn hình mới chọn một khung dưới đây. Mở trang mẫu được nêu để chép cấu trúc, không tự nghĩ bố cục mới.

## 1. Khung chung của trang (trong `DashboardLayout`)

```
┌───────────────────────────────────────────────────────────┐
│ h1 Tiêu đề trang                        [+ Hành động chính] │
│ Mô tả ngắn 1 dòng                                           │
├───────────────────────────────────────────────────────────┤
│ (tuỳ chọn) Dải chỉ số: 3–4 card KPI                         │
├───────────────────────────────────────────────────────────┤
│ Nội dung chính: bảng / card / form                          │
└───────────────────────────────────────────────────────────┘
```

- Gốc trang: `<div className="space-y-6">`.
- Header: `flex flex-col gap-4 sm:flex-row sm:items-center justify-between`. Trên mobile nút chính xuống dưới tiêu đề, rộng hết hàng nếu cần.
- Mẫu: `features/buildings/pages/building-list-page.tsx`.

## 2. Trang danh sách

Dùng `DataTable` + `useDataTableState` + `useDataTable` (mẫu: `building-list-table.tsx`, `use-building-list.ts`, admin `approval-table.tsx`).

- **Thanh công cụ** (`DataTableToolbar`): ô tìm kiếm bên trái (placeholder nói rõ tìm theo gì: "Tìm theo tên, địa chỉ…"), bộ lọc trạng thái dạng nhóm nút (≤ 5 lựa chọn) hoặc `SelectDropdown` (nhiều hơn).
- **Cột:** cột định danh (tên) đầu tiên, ghim trái; cột thao tác cuối, ghim phải. 4–6 cột mặc định; cột phụ ẩn được qua "Tùy chọn hiển thị". Số căn phải. Trạng thái dùng `Badge`.
- **Click hàng** mở chi tiết; nút trong hàng `stopPropagation`.
- **Mobile:** `renderMobileRow` — card với tên + trạng thái ở dòng đầu, 2–3 thông tin chính bên dưới. Không cuộn ngang trên mobile.
- **Phân trang:** mặc định 10 dòng; tổng số và khoảng "1–10 trên 30" luôn hiện.
- **Trạng thái:** `emptyState` (lần đầu, có nút tạo) khác `filteredEmptyState` (có nút xoá bộ lọc).

Việc phải tránh: tìm kiếm chỉ trong trang hiện tại mà không nói rõ; tự viết `<table>` mới; phân trang không giữ trên URL.

## 3. Trang chi tiết

Mẫu: `building-detail-page.tsx`.

```
← Quay lại danh sách
┌ Header: Tên đối tượng  [Badge trạng thái]       [Sửa] [⋯] ┐
│ Thông tin phụ 1 dòng (địa chỉ, ngày tạo)                    │
└─────────────────────────────────────────────────────────────┘
┌ Cột chính (2/3) ───────────────┐ ┌ Cột phụ (1/3) ─────────┐
│ Card thông tin chính            │ │ Card tóm tắt / số liệu │
│ Card danh sách con (phòng…)     │ │ Card tài liệu          │
└─────────────────────────────────┘ └────────────────────────┘
```

- Lưới `grid gap-6 lg:grid-cols-3`, cột chính `lg:col-span-2`. Mobile: một cột, thông tin quan trọng nhất lên trước.
- Hành động phá huỷ (Xoá) nằm trong menu `⋯` hoặc cuối trang, kiểu `danger`, không đặt cạnh nút chính.
- Trạng thái đặc biệt (chờ duyệt, bị từ chối + lý do) hiện bằng `AlertBanner` ngay dưới header.
- Trường không sửa được ở trạng thái hiện tại (vd địa chỉ sau khi duyệt): hiện disabled + giải thích ngắn vì sao.

## 4. Form & dialog

Mẫu: `building-create-modal.tsx`, `building-edit-modal.tsx`, `delete-building-dialog.tsx`.

- **Dialog** cho tạo/sửa ngắn (≤ ~8 ô). Form dài chia **bước** (stepper) hoặc **nhóm có tiêu đề** ("Thông tin chung", "Tiện ích", "Giấy tờ").
- Một cột trên mobile; ô ngắn liên quan đứng cạnh nhau trên desktop (Tỉnh | Phường).
- Thứ tự ô theo cách chủ nhà nghĩ: tên → địa chỉ → chi tiết → tuỳ chọn. Ô bắt buộc trước, tuỳ chọn sau. Khi đa số ô là bắt buộc, ưu tiên ghi "(không bắt buộc)" cạnh ô tuỳ chọn thay vì gắn `*` cho mọi ô.
- Ví dụ trong placeholder phải thực tế ("Ví dụ: Nhà trọ Hòa Khánh 2").
- Footer dialog căn phải: `[Hủy]` (outline) rồi `[Hành động cụ thể]` (primary/danger) ở ngoài cùng bên phải. Nút ghi động từ + đối tượng: "Thêm tòa nhà", "Lưu thay đổi".
- Đóng dialog khi đang có dữ liệu chưa lưu → hỏi lại. Lỗi submit → giữ nguyên dữ liệu.
- Upload file: hiện tên file, dung lượng, tiến trình, nút xoá; nói rõ định dạng và giới hạn trước khi chọn.

### Dialog xác nhận phá huỷ

```
Tiêu đề: Xóa tòa nhà "Nhà trọ Hòa Khánh 2"?
Nội dung: Toàn bộ 12 phòng và dữ liệu liên quan sẽ bị xóa. Không thể hoàn tác.
                              [Hủy]  [Xóa tòa nhà] (danger)
```

Luôn nêu tên đối tượng, hậu quả, và nút ghi đúng hành động (không "OK", "Có").

## 5. Dashboard

Mẫu: `features/dashboard/`.

- Trả lời 3 câu hỏi của chủ nhà theo thứ tự: *Hôm nay có gì cần làm?* (việc chờ: hóa đơn chưa thu, sự cố mới, hợp đồng sắp hết hạn) → *Tình hình thế nào?* (KPI: phòng trống/đang thuê, doanh thu tháng) → *Đi đâu tiếp?* (lối tắt).
- KPI card: số lớn + nhãn + so sánh/ngữ cảnh ngắn; click được thì dẫn đến danh sách đã lọc sẵn.
- Tài khoản mới chưa có dữ liệu: thay dashboard bằng hướng dẫn bắt đầu theo bước (Thêm tòa nhà → Thêm phòng → Tạo hợp đồng), không hiện biểu đồ trống.
- Chỉ hiện số liệu API trả về. Chưa có API thì không vẽ biểu đồ minh hoạ.

## 6. Trạng thái tải / rỗng / lỗi

| Trạng thái | Hiển thị | Component |
|---|---|---|
| Tải lần đầu | Skeleton giống hình dạng nội dung thật (hàng bảng, card) | `Skeleton`, DataTable `isLoading` |
| Tải lại nền (đổi trang, lọc) | Giữ dữ liệu cũ + thanh tiến trình mảnh | `keepPreviousData`, DataTable `isFetching` |
| Rỗng lần đầu | Icon + "Chưa có tòa nhà nào" + 1 câu lợi ích + nút tạo | `EmptyState` |
| Rỗng do lọc | "Không tìm thấy…" + nút xoá bộ lọc | `EmptyState` |
| Lỗi tải | Câu dễ hiểu + nút Thử lại | `ErrorState` |
| Đang gửi | Nút `isLoading`, khoá form | `Button isLoading` |
| Không có quyền / không tồn tại | Trang 403/404 có nút quay lại | `app/pages` |

Spinner toàn màn hình (`LoadingOverlay`) chỉ dùng khi kiểm tra phiên đăng nhập hoặc thao tác chặn toàn trang.
