# Rentify Frontend — Hướng dẫn cho Agent & Developer

Quy chuẩn bắt buộc khi phát triển, refactor hoặc review code trong `fe/` (web cho chủ nhà và admin: React + Vite + TS, TanStack Query, react-hook-form + zod, Tailwind v4, i18next).

File này chỉ giữ các luật cốt lõi. Chi tiết nằm trong skill ở `.agents/skills/` — **đọc `SKILL.md` của skill tương ứng trước khi làm việc**.

## Skill

| Skill                                                                | Đọc khi                                                                                                                        |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [`fe-feature-workflow`](.agents/skills/fe-feature-workflow/SKILL.md) | Bắt đầu một issue / màn hình / luồng CRUD mới — thứ tự làm từ API tới PR                                                       |
| [`fe-structure`](.agents/skills/fe-structure/SKILL.md)               | Tạo, chuyển, đặt tên file/thư mục; thêm route, menu, namespace                                                                 |
| [`fe-code-style`](.agents/skills/fe-code-style/SKILL.md)             | Viết, refactor, review code `.ts`/`.tsx`                                                                                       |
| [`fe-ui-ux`](.agents/skills/fe-ui-ux/SKILL.md)                       | Dựng giao diện, viết text hiển thị, review thay đổi giao diện. Kèm design tokens, khung màn hình, quy tắc viết text tiếng Việt |

Tài liệu kỹ thuật: [`docs/architecture.md`](docs/architecture.md) (các tầng, envelope API, query key, toast, form), [`docs/i18n-guidelines.md`](docs/i18n-guidelines.md), [`docs/media-upload-guide.md`](docs/media-upload-guide.md).

## Luật cốt lõi

1. **Màu:** chỉ dùng token trong `src/index.css` (`bg-rentify-surface`, `text-rentify-text-primary`…). Cấm mã hex trong `className`/`style` và màu Tailwind mặc định.
2. **Component:** dùng primitive có sẵn trong `src/components/ui` và `src/components/feedback`. Không tự dựng modal, button, input, card bằng HTML thô.
3. **Text & 100% i18n:** tuyệt đối không hardcode bất kỳ chuỗi hiển thị nào (kể cả nhãn đơn vị như `đ/tháng`, `xe`, ghi chú cảnh báo, placeholder, trạng thái upload...). Tất cả PHẢI đi qua `useTranslation(ns)`; thêm key đầy đủ ở cả `vi` và `en`.
4. **Lỗi API & Toast:** Mọi phản hồi lỗi từ API được xử lý qua hệ thống Toast (interceptor trong `src/lib/api/client.ts` tự động toast hoặc dùng hook `useNotify()`). Tuyệt đối không nhồi server error vào form input hay form state (không dùng `form.setError` hay `setFormApiErrors` cho response từ API). Client-side validation trên FE (Zod schema hoặc logic kiểm tra trước khi submit) thì hiển thị lỗi inline bình thường. Không gán `skipErrorToast: true` vô cớ.
5. **Vị trí Hook:** TẤT CẢ custom hook (bắt đầu bằng `use-`, kể cả form hook `use-*-form.ts`, modal hook, step hook) BẮT BUỘC nằm trong thư mục `src/features/<feature>/hooks/`. Thư mục `forms/` CHỈ chứa Zod schema (`*.schema.ts`).
6. **Tách State khỏi Component (State Extraction):** Component UI chỉ làm nhiệm vụ render JSX (≤ 200 dòng). Nếu component quản lý từ 3+ state/query/effect hoặc logic phức tạp > 20 dòng, BẮT BUỘC phải bóc tách ra một custom hook riêng trong `hooks/`.
7. **Quản lý Route tập trung:** không hardcode chuỗi route rải rác (như `'/contracts'`, `'/contracts/' + id`). Bắt buộc dùng hằng số `ROUTES` tập trung từ `@/config/routes.config`.
8. **Quy chuẩn Mutation & Query Hook:**
   - Hook mutation/query luôn hỗ trợ nhận `MutationHookOptions` / `QueryHookOptions` từ caller để linh hoạt cấu hình.
   - ID tài nguyên chính (`contractId`, `buildingId`...) BẮT BUỘC non-nullable (`string`), không để `string | null | undefined` khi caller đã chắc chắn có ID.
   - Tuyệt đối không hardcode kích thước trang (`pageSize: 100`...); luôn hỗ trợ tham số phân trang tuỳ chọn (`params?: ListParams`) và bọc param vào `QUERY_KEYS`.
9. **Tạo/sửa:** mở bằng `Dialog` trên trang hiện tại, hạn chế route `/new`, `/:id/edit`.
10. **Dữ liệu thật:** chỉ hiển thị field có trong DTO của API. Tính năng chưa có API thì chưa làm UI, không vẽ số liệu giả.
11. **Form/Modal liên kết người dùng hệ thống:** Khi làm form/modal thêm thành viên/người dùng (thành viên hợp đồng, khách thuê...), luôn hỗ trợ 2 chế độ: chọn tài khoản có sẵn trong hệ thống (Directory search) và nhập tay thủ công. Khi chọn tài khoản hệ thống, tự động điền/gán thông tin sẵn có (như SĐT, họ tên...).
12. **Kiểm tra:** `npm run build`, `npm run lint`, `npm run i18n:check` phải sạch 100%. Không viết file `*.test.ts`.
