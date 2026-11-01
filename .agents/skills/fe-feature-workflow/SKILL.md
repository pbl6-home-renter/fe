---
name: fe-feature-workflow
description: Step-by-step workflow for building a feature or screen in the Rentify landlord web (fe/) — from the pm issue and the api-docs contract, through DTOs, api, query keys, hooks, forms, components, routes, menu and i18n, to verification and the pull request. Use when starting a pm/phase-N issue that touches fe/, when adding a new screen or CRUD flow, or when asked to "implement" something in fe/.
license: Apache-2.0
metadata:
  version: "1.0.0"
  category: workflow
  author: Rentify FE
---

# Quy trình làm một feature — Rentify FE

Skill này là thứ tự làm việc. Mỗi bước trỏ tới skill/tài liệu chứa quy tắc chi tiết:

- Đặt file ở đâu: `fe-structure`
- Viết code thế nào: `fe-code-style`
- Giao diện, text: `fe-ui-ux`
- Mẫu từng tầng: [`docs/architecture.md`](../../../docs/architecture.md), [`docs/i18n-guidelines.md`](../../../docs/i18n-guidelines.md), [`docs/media-upload-guide.md`](../../../docs/media-upload-guide.md)

## Bước 0 — Hiểu việc cần làm

1. Đọc issue trong `pm/phase-N/issues/` (acceptance criteria, ngoài phạm vi). Phạm vi chính thức ở `pm/requirement.md` — không thêm tính năng ngoài đó.
2. Xác định **ai dùng** (Chú Hùng / Chị Mai / Admin — xem `fe-ui-ux`) và **việc chính** của màn hình trong một câu.
3. Mở contract trong `api-docs/src/` (hoặc `api-docs/reference/rentify.json`): endpoint, query param (`filter[...]`, `sort`, giới hạn `pageSize`), body, mã `code` thành công/lỗi.
4. API chưa có hoặc thiếu field → **dừng phần đó**, báo lại; không bịa dữ liệu, không làm UI giả.
5. Tìm màn hình đã có giống nhất (danh sách → `buildings` list; chi tiết → building detail; duyệt → admin approval) để làm theo.

## Bước 1 — Nhánh

```bash
git switch main && git pull
git switch -c feat/<issue-id>-<slug>     # vd feat/p6-03c-room-list
```

## Bước 2 — Tầng dữ liệu (từ dưới lên)

1. `types/<f>.dto.ts`: chép DTO từ api-docs, giữ nguyên tên field.
2. `api/<f>.api.ts`: hàm gọi qua `http.get / getPage / post / put / patch / delete`. Endpoint chỉ gọi từ form thì đặt `skipErrorToast`.
3. `constants/<f>.constants.ts`: `<F>_QUERY_KEYS` (`ALL`, `LIST(params)`, `DETAIL(id)`).
4. `hooks/`: một file cho mỗi query/mutation. Mutation invalidate `ALL`.
5. Namespace mới → khai báo ở `src/i18n/i18n.d.ts` và `API_CODE_NAMESPACES`; thêm `apiSuccess.<CODE>` / `apiErrors.<CODE>` cho các mã backend trả về.

## Bước 3 — Form (nếu có)

1. `forms/<noun>.schema.ts`: Zod + `z.infer`; message là i18n key.
2. `forms/use-<noun>-form.ts`: `useForm` + mutation + đóng dialog/điều hướng khi thành công; lỗi 422 → `setFormApiErrors`.
3. Tạo và sửa dùng chung schema và component form khi có thể.

## Bước 4 — Giao diện

1. Chọn khung trong `fe-ui-ux/references/screen-patterns.md` (danh sách / chi tiết / form-dialog / dashboard).
2. Hook màn hình `hooks/use-<screen>.ts` gom state, query, handler; trang `.tsx` chỉ render.
3. Chia component theo khối giao diện, mỗi file ≤ 200 dòng.
4. Làm đủ 4 trạng thái: loading, empty, filtered-empty, error.
5. Kiểm tra ở 360px và 1440px.

## Bước 5 — Route, menu, text

1. Route trong `app/routes/roles/<role>.routes.tsx`, bọc `ProtectedRoute allowedRoles`.
2. Mục menu trong `config/navigation.config.ts` (dùng `titleKey`).
3. Text vào `locales/vi` trước, rồi `en` cùng key (`npm run i18n:sync` hỗ trợ đồng bộ). Kiểm thuật ngữ với `fe-ui-ux/references/copy-vi.md`.

## Bước 6 — Kiểm tra

```bash
npm run build         # tsc + vite
npm run lint
npm run i18n:check
npm run dev           # bấm thử luồng chính
```

Test tay tối thiểu:

- Luồng chính từ đầu đến cuối với dữ liệu thật từ API.
- Lỗi: tắt mạng / API trả lỗi → có ErrorState hoặc toast, không trắng màn hình.
- URL: F5 giữ bộ lọc/trang; sửa tay param sai (`?page=999`, `?status=abc`) không vỡ trang.
- Bàn phím: Tab, Enter, Esc.
- Đổi ngôn ngữ vi ↔ en: không còn chuỗi cứng.
- Mobile 360px.

Không viết file `*.test.ts` (dự án không dùng test ở fe).

## Bước 7 — Tự review & PR

1. Chạy checklist ở cuối `fe-code-style` và `fe-ui-ux`.
2. Xem lại `git diff`: không còn code thừa, file rác, `console.log`, thay đổi không liên quan (kể cả đổi dòng CRLF/LF).
3. Commit theo Conventional Commits, tiếng Anh: `feat(rooms): room list with status filter`.
4. PR vào `main` (repo `fe` không có `develop`), mô tả bằng tiếng Việt:

```markdown
## Tóm tắt
<màn hình/luồng gì, cho ai, issue nào (P6-xx)>

## Thay đổi chính
- …

## Ảnh chụp
<desktop + mobile>

## Còn tồn đọng
<phụ thuộc backend, giới hạn đã biết>

## Kiểm thử
- [x] npm run build / lint / i18n:check
- [ ] <các bước test tay>
```

5. Cập nhật trạng thái issue trong `pm/phase-N/issues/README.md` nếu bạn phụ trách việc đó.
