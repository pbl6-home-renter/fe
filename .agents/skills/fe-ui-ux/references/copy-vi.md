# Viết text giao diện — Rentify FE

Tiếng Việt là ngôn ngữ gốc (`locales/vi`), tiếng Anh dịch theo. Viết tiếng Việt trước, rồi thêm bản `en` cùng key.

## Giọng văn

- Gọi người dùng là **"bạn"**. Lịch sự, ngắn, như một người quản lý tòa nhà giỏi đang nói chuyện — không như phần mềm kế toán.
- **Sentence case:** chỉ viết hoa chữ đầu câu và tên riêng. ✅ "Thêm tòa nhà" ❌ "Thêm Tòa Nhà", "Thêm Tòa nhà".
- Một câu một ý. Mô tả dưới tiêu đề ≤ 1 dòng trên laptop.
- Không dùng từ tiếng Anh khi có từ Việt quen thuộc: "Bảng điều khiển/Tổng quan" thay "Dashboard", "Trạng thái" thay "Status". Giữ nguyên tên riêng: Rentify, VietQR, Zalo.
- Không chấm than, không đùa, không emoji trong giao diện nghiệp vụ.

## Thuật ngữ thống nhất

Dùng đúng một từ cho một khái niệm ở mọi màn hình.

| Khái niệm | Dùng | Không dùng |
|---|---|---|
| landlord | Chủ nhà | Chủ trọ (trong UI), Landlord, Owner |
| tenant | Khách thuê | Người thuê trọ, Tenant |
| building | Tòa nhà | Nhà, Khu, Building |
| room | Phòng | Căn, Unit |
| occupied / vacant | Đang thuê / Phòng trống | Đã lấp đầy, Occupied |
| occupancy rate | Tỷ lệ lấp đầy | Occupancy |
| contract | Hợp đồng | HĐ (viết tắt trong UI) |
| invoice | Hóa đơn | Bill, Phiếu thu |
| meter reading | Chốt số điện nước / Chỉ số công tơ | Meter, Đọc số |
| deposit | Tiền cọc | Đặt cọc (khi là danh từ số tiền) |
| issue report | Sự cố | Ticket, Issue |
| pending / approved / rejected | Chờ duyệt / Đã duyệt / Bị từ chối | Pending, Duyệt OK |
| admin | Quản trị viên | Admin |

Chính tả: dùng "hóa", "hủy", "xóa", "tòa" (đặt dấu kiểu cũ) cho thống nhất với text đang có.

## Nút & liên kết

- **Động từ + đối tượng:** "Thêm tòa nhà", "Lưu thay đổi", "Gửi duyệt", "Xóa phòng", "Tải lên giấy tờ".
- Tránh nút mơ hồ: "OK", "Có", "Xác nhận" đứng một mình, "Submit", "Tiếp tục" khi không rõ tiếp tục gì.
- Nút huỷ luôn là "Hủy". Nút quay lại: "Quay lại danh sách" (nói rõ về đâu).
- Liên kết nói đích đến: "Xem chi tiết phòng", không "Bấm vào đây".

## Thông báo lỗi

Công thức: **chuyện gì xảy ra + làm gì tiếp**. Không đổ lỗi người dùng, không lộ mã kỹ thuật.

| ❌ | ✅ |
|---|---|
| "Invalid input" | "Số phòng phải từ 1 đến 500." |
| "Lỗi 422" | "Địa chỉ chưa đúng. Kiểm tra lại số nhà và tên đường." |
| "Không thể thực hiện" | "Không tải được danh sách tòa nhà. Kiểm tra kết nối mạng rồi thử lại." |
| "Trường bắt buộc" | "Nhập tên tòa nhà." |

- Lỗi validation (Zod): nói cách sửa, ngắn, không lặp tên ô nếu đã ở ngay dưới ô.
- Lỗi API: thêm bản dịch `apiErrors.<CODE>` trong namespace của feature; interceptor tự hiển thị.

## Thông báo thành công

- Ngắn, thì quá khứ: "Đã thêm tòa nhà", "Đã lưu thay đổi", "Đã gửi yêu cầu duyệt".
- Nếu có bước tiếp theo quan trọng thì nói: "Đã thêm tòa nhà. Gửi giấy tờ sở hữu để được duyệt."

## Trạng thái rỗng

- Tiêu đề nói thực trạng: "Chưa có tòa nhà nào".
- Mô tả nói lợi ích của bước tiếp: "Thêm tòa nhà đầu tiên để bắt đầu quản lý phòng và hợp đồng."
- Nút là hành động đó: "Thêm tòa nhà".

## Xác nhận

- Tiêu đề là câu hỏi có tên đối tượng: `Xóa tòa nhà "{{name}}"?`
- Nội dung nêu hậu quả cụ thể, câu cuối "Không thể hoàn tác." nếu đúng.
- Nút chính lặp lại hành động: "Xóa tòa nhà".

## Số, tiền, ngày

- Tiền: `formatVnd` → `1.500.000 đ`. Không "1,500,000 VND", không "1.5tr" trong bảng.
- Ngày: `formatDate` → `31/10/2026`; tháng hóa đơn: `formatMonth` → `10/2026`; có giờ: `formatDateTime`.
- Đếm có đơn vị: "12 phòng", "3 tòa nhà" — dùng plural của i18next (`_one`/`_other`) cho bản `en`.
- Phần trăm: tối đa 1 chữ số thập phân (`86.7%`, `100%`).
