# Rentify Frontend — Hướng dẫn cho Agent & Developer

Quy chuẩn bắt buộc khi phát triển, refactor hoặc review code trong `fe/` (web cho chủ nhà và admin: React + Vite + TS, TanStack Query, react-hook-form + zod, Tailwind v4, i18next).

File này chỉ giữ các luật cốt lõi. Chi tiết nằm trong skill ở `.agents/skills/` — **đọc `SKILL.md` của skill tương ứng trước khi làm việc**.

## Skill

| Skill | Đọc khi |
|---|---|
| [`fe-feature-workflow`](.agents/skills/fe-feature-workflow/SKILL.md) | Bắt đầu một issue / màn hình / luồng CRUD mới — thứ tự làm từ API tới PR |
| [`fe-structure`](.agents/skills/fe-structure/SKILL.md) | Tạo, chuyển, đặt tên file/thư mục; thêm route, menu, namespace |
| [`fe-code-style`](.agents/skills/fe-code-style/SKILL.md) | Viết, refactor, review code `.ts`/`.tsx` |
| [`fe-ui-ux`](.agents/skills/fe-ui-ux/SKILL.md) | Dựng giao diện, viết text hiển thị, review thay đổi giao diện. Kèm design tokens, khung màn hình, quy tắc viết text tiếng Việt |

Tài liệu kỹ thuật: [`docs/architecture.md`](docs/architecture.md) (các tầng, envelope API, query key, toast, form), [`docs/i18n-guidelines.md`](docs/i18n-guidelines.md), [`docs/media-upload-guide.md`](docs/media-upload-guide.md).

## Luật cốt lõi

1. **Màu:** chỉ dùng token trong `src/index.css` (`bg-rentify-surface`, `text-rentify-text-primary`…). Cấm mã hex trong `className`/`style` và màu Tailwind mặc định.
2. **Component:** dùng primitive có sẵn trong `src/components/ui` và `src/components/feedback`. Không tự dựng modal, button, input, card bằng HTML thô.
3. **Text:** không hardcode chuỗi hiển thị. Dùng `useTranslation(ns)`; thêm key ở cả `vi` và `en`; constants lưu `titleKey`/`labelKey`, không gọi `i18n.t` ở cấp module.
4. **Lỗi API:** interceptor trong `src/lib/api/client.ts` tự toast. Không `try/catch` để `console.error`/`toast.error` thủ công; lỗi field 422 dùng `setFormApiErrors`.
5. **Kiến trúc:** `pages → forms → hooks → api`. Feature chỉ gọi API qua `http`. Không file `index.ts` (barrel).
6. **Kích thước:** file `.tsx` ≤ 200 dòng, chủ yếu là JSX; logic tách ra hook `use-<component>.ts`.
7. **Tạo/sửa:** mở bằng `Dialog` trên trang hiện tại, hạn chế route `/new`, `/:id/edit`.
8. **Dữ liệu thật:** chỉ hiển thị field có trong DTO của API. Tính năng chưa có API thì chưa làm UI, không vẽ số liệu giả.
9. **Phạm vi:** theo `pm/requirement.md`; không thêm tính năng ngoài phạm vi khi chưa được PM duyệt.
10. **Kiểm tra:** `npm run build`, `npm run lint`, `npm run i18n:check` phải sạch. Không viết file `*.test.ts`.
