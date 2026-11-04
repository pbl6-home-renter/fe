import { ConversationList } from '../components/conversation-list';
import { NewChatDialog } from '../components/new-chat-dialog';
import { ChatWindow } from '../components/chat-window';
import { useChatPage } from '../hooks/use-chat-page';

export const ChatPage = () => {
  const page = useChatPage();
  const hasSelection = Boolean(page.id || page.recipient);

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden bg-rentify-surface md:rounded-xl md:border md:border-rentify-divider">
      <div className={hasSelection ? 'hidden h-full min-h-0 md:flex' : 'flex h-full min-h-0 w-full md:w-auto'}>
        <ConversationList
          search={page.search}
          selectedId={page.id}
          onSearchChange={page.onSearchChange}
          onSelect={page.onSelectConversation}
          onNewChat={page.onOpenDialog}
        />
      </div>
      <ChatWindow
        key={page.id ?? page.recipient?.id ?? 'empty'}
        conversationId={page.id}
        draftRecipient={page.recipient}
        connectionStatus={page.connectionStatus}
        draft={page.draft}
        pending={page.pending}
        isSending={page.isSending}
        onDraftChange={page.onDraftChange}
        onSend={page.onSend}
        onRetry={page.onRetry}
        onBack={page.onBack}
      />
      <NewChatDialog
        open={page.dialogOpen}
        onClose={page.onCloseDialog}
        onSelectDirect={page.onSelectDirect}
        onGroupCreated={page.onGroupCreated}
      />
    </div>
  );
};
