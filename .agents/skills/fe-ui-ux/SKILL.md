---
name: fe-ui-ux
description: UI/UX rules for the Rentify landlord web (fe/) grounded in the project's personas — a low-tech landlord with ~25 rooms (Chú Hùng), a tech-savvy manager with ~45 units (Chị Mai), and the admin who approves buildings. Covers layout, page anatomy, lists/tables, forms and dialogs, status display, loading/empty/error states, Vietnamese UI copy, accessibility and the design tokens. Use when designing or building any screen or component in fe/, when writing UI text, and when reviewing a PR that changes what users see.
license: Apache-2.0
metadata:
  version: "1.0.0"
  category: design
  author: Rentify FE
---

# UI/UX — Rentify FE

Web Rentify là **bàn làm việc của chủ nhà** (landlord ops console) và màn hình duyệt của admin. Người thuê dùng app mobile là chính; web chỉ cần hiển thị được cho họ trên điện thoại. Mọi quyết định giao diện phải trả lời được: *Chú Hùng có tự làm được việc này mà không cần ai chỉ không, và Chị Mai có làm nhanh được không?*

Nguồn: persona và pain point trong `pm/phase-0/discovery/vision.md`, `P0-01-landlor_report.md`; đánh giá đối thủ trong `pm/phase-0/discovery/p0-02/ux-web.md`.

## Khi nào dùng

- Thiết kế/dựng trang, component, dialog, bảng, form mới.
- Viết hoặc sửa text hiển thị (i18n `vi`/`en`).
- Review PR có thay đổi giao diện.

Tài liệu đi kèm (đọc khi cần):

- [`references/design-tokens.md`](references/design-tokens.md) — màu, bo góc, bóng đổ, chữ, khoảng cách.
- [`references/screen-patterns.md`](references/screen-patterns.md) — khung trang danh sách, chi tiết, form/dialog, dashboard, trạng thái tải/rỗng/lỗi.
- [`references/copy-vi.md`](references/copy-vi.md) — giọng văn, thuật ngữ, cách viết nút, lỗi, xác nhận.

## 1. Thiết kế cho ai

| Persona | Họ là ai | Họ cần gì từ giao diện |
|---|---|---|
| **Chú Hùng** — chủ trọ truyền thống | ~25 phòng, quen sổ tay + Zalo, tech-comfort thấp, đã từng xoá app vì "nhức đầu" | Mở ra là biết bấm đâu. Chữ đủ to, nhãn rõ, ít bước, không thuật ngữ kế toán/IT, có xác nhận trước khi làm việc không quay lại được |
| **Chị Mai** — quản lý căn hộ dịch vụ | ~45 căn, rành Google Sheets, muốn chuyên nghiệp | Xem nhiều dữ liệu một lúc, lọc/sắp xếp/tìm nhanh, link chia sẻ giữ bộ lọc, không bị bắt qua nhiều màn hình |
| **Admin** | Nhóm vận hành duyệt tòa nhà, hồ sơ | Hàng đợi rõ ràng, xem đủ bằng chứng trước khi duyệt/từ chối, lý do từ chối bắt buộc |
| **Khách thuê** (web phụ) | Sinh viên / người đi làm, chủ yếu dùng điện thoại | Web vẫn đọc được ở 360px; không cần tối ưu sâu |

Thiết bị chuẩn: **laptop 1366–1440px** là chính. Mọi màn hình phải dùng được ở **≥ 360px** (bảng chuyển sang card, sidebar thành drawer).

**Khi hai persona mâu thuẫn:** mặc định đơn giản cho Chú Hùng, sức mạnh cho Chị Mai đặt ở tầng thứ hai (bộ lọc nâng cao, tuỳ chỉnh cột, mật độ dòng trong "Tùy chọn hiển thị"). Không bao giờ để tính năng nâng cao chen vào luồng chính.

## 2. Mười nguyên tắc

1. **Một việc chính mỗi màn hình.** Mỗi trang có đúng một nút `primary` (vd "Thêm tòa nhà"), ở góc phải tiêu đề. Các hành động khác là `outline`/`ghost`.
2. **Nhìn là hiểu, không cần đoán.** Nhãn bằng chữ đi kèm icon; icon đứng một mình chỉ cho hành động quá quen (đóng, tìm kiếm) và luôn có `aria-label`.
3. **Ngôn ngữ của chủ trọ.** "Phòng trống", "Đang thuê", "Chốt số điện nước", "Hóa đơn tháng 10" — không "occupancy", "entity", "record", "submit". Xem `references/copy-vi.md`.
4. **Giữ ngữ cảnh.** Tạo/sửa mở `Dialog` trên trang hiện tại; xong thì đóng và dữ liệu tự làm mới. Không chuyển trang khi không cần.
5. **Trạng thái không chỉ bằng màu.** Luôn có chữ (Badge / StatusDot + nhãn), màu chỉ hỗ trợ. Cùng một trạng thái dùng cùng màu ở mọi nơi.
6. **Mọi danh sách có 4 trạng thái:** đang tải (skeleton đúng hình dạng), rỗng lần đầu (giải thích + nút tạo), rỗng do lọc (nút xoá bộ lọc), lỗi (nút Thử lại). Không bao giờ để màn hình trắng.
7. **Ngăn lỗi trước khi báo lỗi.** Chọn thay vì gõ (tỉnh/phường, trạng thái), giá trị mặc định hợp lý, giới hạn ô số, báo lỗi ngay khi rời ô. Hành động phá huỷ phải xác nhận và nêu đúng tên đối tượng.
8. **Số liệu thật, định dạng Việt Nam.** Tiền `1.500.000 đ` (`formatVnd`), ngày `dd/MM/yyyy` (`formatDate`), số căn phải + `tabular-nums`. Không hiển thị số ước tính/bịa khi API chưa có.
9. **Nhanh cho người làm nhiều.** Bộ lọc, trang, sắp xếp lưu trên URL; tìm kiếm có debounce; bàn phím dùng được (Tab, Enter, Esc); tuỳ chỉnh cột được nhớ.
10. **Nhất quán hơn sáng tạo.** Dùng component có sẵn; màn hình mới trông như "anh em" với màn hình cũ (khung trang, khoảng cách, vị trí nút giống nhau).

## 3. Kích thước & khả năng tiếp cận

- Chữ nội dung tối thiểu **14px** (`text-sm`). `text-xs` (12px) chỉ cho nhãn phụ, meta, badge — không cho nội dung cần đọc kỹ.
- Vùng bấm tối thiểu **40×40px** (Button `md` = 42px). Nút `sm` chỉ dùng trong bảng/thanh công cụ dày.
- Tương phản: chữ chính `text-rentify-text-primary`; chữ phụ `text-rentify-text-secondary` chỉ trên nền sáng. Không đặt chữ xám trên nền xám.
- Focus luôn nhìn thấy (`focus-visible:ring-2 ring-rentify-primary`). Không `outline-none` mà không có ring thay thế.
- Mỗi trang một `h1`; tiêu đề card là `h2`/`h3` theo thứ tự.
- Form: mọi ô có `label` hiển thị (placeholder không thay label), lỗi nằm ngay dưới ô, liên kết bằng `aria-describedby` (Input đã làm).
- Bảng có `caption` (ẩn được), `th scope="col"`, `aria-sort` khi sắp xếp.
- Ảnh có `alt`; ảnh trang trí `alt=""`.

## 4. Chuyển động & phản hồi

- Mọi hành động có phản hồi trong < 100ms: nút chuyển `isLoading`, hàng có hover, thanh tiến trình mảnh khi tải lại nền.
- Thành công/lỗi API: toast do interceptor lo — component không tự toast lỗi API. Toast thành công ngắn ("Đã thêm tòa nhà").
- Animation ngắn (150–200ms), chỉ cho chuyển trạng thái (mở dialog, hover). Không animation trang trí làm chậm thao tác.

## 5. Review checklist (dán vào PR có đổi giao diện)

- [ ] Có đúng 1 nút primary; vị trí và kiểu nút giống các trang khác.
- [ ] Đủ 4 trạng thái: loading skeleton, empty, filtered-empty, error + retry.
- [ ] Không hex/màu Tailwind mặc định; trạng thái có chữ, không chỉ màu.
- [ ] Text qua i18n, có ở `vi` và `en`; đúng thuật ngữ trong `copy-vi.md`; sentence case.
- [ ] Chữ nội dung ≥ 14px; vùng bấm ≥ 40px; focus nhìn thấy; icon-only có `aria-label`.
- [ ] Tiền/ngày dùng `formatVnd`/`formatDate`; số có `tabular-nums`; không số liệu bịa.
- [ ] Dùng được ở 360px và 1440px (bảng → card, không cuộn ngang cả trang).
- [ ] Hành động phá huỷ có dialog xác nhận nêu tên đối tượng và hậu quả.
- [ ] Form: label rõ, lỗi dưới ô, giữ dữ liệu đã nhập khi lỗi, nút submit có loading.
- [ ] Bộ lọc/trang/tìm kiếm còn nguyên sau F5; link chia sẻ mở đúng màn hình.
- [ ] Bàn phím: Tab tới được mọi control, Enter mở hàng, Esc đóng dialog.
