import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import './Messages.css';

const STATIC_CONVOS = [
  { id: 1, name: 'Sarah Chen', company: 'TechCorp', initials: 'SC', lastMsg: 'Thanks for the proposal. Can we discuss the boxes...', time: '2h ago', starred: true, unread: true },
  { id: 2, name: 'John Smith', company: 'BuildCo', initials: 'JS', lastMsg: 'Can we set up a meeting to discuss specs in...', time: 'Yesterday', starred: false, unread: false },
  { id: 3, name: 'Emily Davis', company: 'RetailMax', initials: 'ED', lastMsg: 'New box design looks great! We sent the quote.', time: 'Feb 25', starred: false, unread: false },
];

const STATIC_MESSAGES = [
  { id: 1, sender: 'Sarah Chen', initials: 'SC', time: '10:30 AM', text: 'Hi! I saw your proposal for corporate gift boxes. Looks promising!', isMe: false },
  { id: 2, sender: 'You', initials: 'Y', time: '10:32 AM', text: 'Thank you! I\'m confident we can meet your needs.', isMe: true, sent: true },
  { id: 3, sender: 'Sarah Chen', initials: 'SC', time: '3:20 PM', text: 'Can we discuss the specifications? We need delivery by March 15.', isMe: false },
  { id: 4, sender: 'You', initials: 'Y', time: '3:21 PM', text: 'Absolutely! We can deliver within 12 business days.', isMe: true, sent: true },
  { id: 5, sender: 'Sarah Chen', initials: 'SC', time: '3:23 PM', text: '', isMe: false, file: { name: 'updated_requirements.pdf', size: '2.3 MB' } },
];

const SHARED_FILES = [
  { name: 'proposal_v2.pdf', date: 'Mar 10', size: '1.2 MB', icon: '📄' },
  { name: 'updated_req.pdf', date: 'Mar 11', size: '2.3 MB', icon: '📄' },
  { name: 'product_sample.jpg', date: 'Mar 12', size: '560 KB', icon: '🖼' },
];

export default function Messages() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeConvo, setActiveConvo] = useState(STATIC_CONVOS[0]);
  const [messages, setMessages] = useState(STATIC_MESSAGES);
  const [convos, setConvos] = useState(STATIC_CONVOS);
  const [newMsg, setNewMsg] = useState('');
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');
  const [activePanel, setActivePanel] = useState('chat');
  const [typing, setTyping] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    async function fetchConvos() {
      try {
        const { data: convData } = await supabase.from('conversations').select('*, conversation_participants(user_id)').limit(10);
        if (convData && convData.length > 0) {
          // Use static data as fallback since we need profile joins
        }
        // Use static messages - Supabase messages need profile joins for names
      } catch(e) {}
    }
    fetchConvos();
  }, []);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    const msg = { id: messages.length + 1, sender: 'You', initials: 'Y', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: newMsg, isMe: true, sent: false };
    setMessages(m => [...m, msg]);
    setNewMsg('');
    try {
      await supabase.from('messages').insert([{ conversation_id: 1, content: newMsg, is_read: false }]);
      setMessages(m => m.map(msg2 => msg2.id === msg.id ? { ...msg2, sent: true } : msg2));
    } catch(e) {}
  };

  const filtered = convos.filter(c => {
    if (activeFilter === 'unread') return c.unread;
    if (activeFilter === 'archived') return false;
    if (activeFilter === 'starred') return c.starred;
    return true;
  }).filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="msg__page" dir={i18n.dir()}>
      {/* Top bar */}
      <header className="msg__header">
        <button className="msg__back" onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Dashboard
        </button>
        <h1 className="msg__title">Messages</h1>
        <div className="msg__header-tabs">
          {['Ref', 'Chat', 'Profile'].map(tab => (
            <button key={tab} className={`msg__header-tab ${activePanel === tab.toLowerCase() ? 'msg__header-tab--active' : ''}`}
              onClick={() => setActivePanel(tab.toLowerCase())}>{tab}</button>
          ))}
        </div>
      </header>

      <div className="msg__layout">
        {/* Sidebar */}
        <aside className="msg__sidebar">
          <div className="msg__search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#555" strokeWidth="1.5"/><path d="M21 21l-4.35-4.35" stroke="#555" strokeWidth="1.5"/></svg>
            <input placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="msg__filters">
            {['all', 'unread', 'archived', 'starred'].map(f => (
              <button key={f} className={`msg__filter ${activeFilter === f ? 'msg__filter--active' : ''}`}
                onClick={() => setActiveFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
            ))}
          </div>

          <div className="msg__convos">
            {filtered.map(c => (
              <div key={c.id} className={`msg__convo ${activeConvo?.id === c.id ? 'msg__convo--active' : ''}`}
                onClick={() => setActiveConvo(c)}>
                <div className="msg__convo-avatar">{c.initials}</div>
                <div className="msg__convo-body">
                  <div className="msg__convo-top">
                    <span className="msg__convo-name">{c.name} · {c.company}</span>
                    {c.starred && <span className="msg__convo-star">★</span>}
                  </div>
                  <p className="msg__convo-preview">{c.lastMsg}</p>
                  <span className="msg__convo-time">{c.time}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat */}
        <main className="msg__chat">
          {activeConvo && (
            <>
              <div className="msg__chat-header">
                <div className="msg__chat-header-left">
                  <div className="msg__chat-avatar">{activeConvo.initials}</div>
                  <div>
                    <h3 className="msg__chat-name">{activeConvo.name} · {activeConvo.company}</h3>
                    <p className="msg__chat-role">Procurement Professional</p>
                  </div>
                </div>
                <div className="msg__chat-actions">
                  <button className="msg__chat-btn">Star</button>
                  <button className="msg__chat-btn">Archive</button>
                  <button className="msg__chat-btn">More</button>
                </div>
              </div>

              <div className="msg__messages">
                <div className="msg__date-divider">
                  <span>[Beginning of conversation: March 15, 2026]</span>
                </div>

                {messages.map((m, i) => (
                  <div key={i} className={`msg__message ${m.isMe ? 'msg__message--me' : ''}`}>
                    {!m.isMe && <div className="msg__msg-avatar">{m.initials}</div>}
                    <div className="msg__msg-body">
                      <div className="msg__msg-meta">
                        <span className="msg__msg-sender">{m.sender}</span>
                        <span className="msg__msg-time">{m.time}</span>
                      </div>
                      {m.file ? (
                        <div className="msg__msg-file">
                          <div className="msg__file-icon">📄</div>
                          <div className="msg__file-info">
                            <span className="msg__file-name">{m.file.name}</span>
                            <span className="msg__file-size">{m.file.size}</span>
                          </div>
                          <button className="msg__file-download">Download</button>
                        </div>
                      ) : (
                        <div className={`msg__bubble ${m.isMe ? 'msg__bubble--me' : ''}`}>{m.text}</div>
                      )}
                      {m.isMe && <span className="msg__sent">Sent {m.sent ? '✓' : ''}</span>}
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="msg__typing">{activeConvo.name} is typing...</div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="msg__composer">
                <div className="msg__composer-actions">
                  <button className="msg__composer-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                    Attach
                  </button>
                  <button className="msg__composer-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    Image
                  </button>
                  <button className="msg__composer-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    File
                  </button>
                </div>
                <div className="msg__input-row">
                  <input className="msg__input" placeholder="Type your message..."
                    value={newMsg} onChange={e => setNewMsg(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                  <button className="msg__send" onClick={sendMessage}>
                    Send
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </main>

        {/* Right panel */}
        <aside className="msg__panel">
          {activeConvo && (
            <>
              <div className="msg__panel-profile">
                <div className="msg__panel-avatar">{activeConvo.initials}</div>
                <h3 className="msg__panel-name">{activeConvo.name}</h3>
                <p className="msg__panel-role">Procurement Professional</p>
                <p className="msg__panel-company">{activeConvo.company}</p>
                <p className="msg__panel-status">(Online)</p>
                <p className="msg__panel-last">Last response 2h ago</p>
              </div>

              <div className="msg__panel-section">
                <h4>Quick Actions:</h4>
                <button className="msg__panel-btn" onClick={() => navigate('/vendor/profile')}>View Profile</button>
                <button className="msg__panel-btn">View Their Needs</button>
                <button className="msg__panel-btn">Schedule Meeting</button>
              </div>

              <div className="msg__panel-section">
                <h4>Related Content</h4>
                <div className="msg__related">
                  <div className="msg__related-thumb" />
                  <div>
                    <p className="msg__related-need">Need: "500 Corporate Gift Boxes"</p>
                    <p className="msg__related-detail">Budget: $15-25 per unit</p>
                    <p className="msg__related-detail">Deadline: March 15, 2026</p>
                    <button className="msg__related-btn">View Full Post</button>
                  </div>
                </div>
              </div>

              <div className="msg__panel-section">
                <h4>Your Proposal Status:</h4>
                <div className="msg__proposal-status">
                  <p>Status: <span style={{ color: '#00A7E5' }}>Submitted</span></p>
                  <p>Date: March 10, 2026</p>
                </div>
                <button className="msg__panel-btn">View Your Proposal</button>
              </div>

              <div className="msg__panel-section">
                <h4>Shared Files (3)</h4>
                {SHARED_FILES.map((f, i) => (
                  <div key={i} className="msg__shared-file">
                    <span className="msg__shared-icon">{f.icon}</span>
                    <div className="msg__shared-info">
                      <span className="msg__shared-name">{f.name}</span>
                      <span className="msg__shared-meta">{f.date} · {f.size}</span>
                    </div>
                    <button className="msg__shared-download">Download</button>
                  </div>
                ))}
                <button className="msg__panel-btn">View All Files</button>
              </div>

              <div className="msg__panel-section">
                <h4>Notes (Private - Only You See)</h4>
                <textarea className="msg__notes" placeholder="Add private notes about this conversation..."
                  value={note} onChange={e => setNote(e.target.value)} rows={4} />
                <button className="msg__panel-btn">Save Note</button>
              </div>

              <div className="msg__panel-section">
                <h4>Conversation Settings</h4>
                <button className="msg__settings-btn">Mute Notifications</button>
                <button className="msg__settings-btn">Archive Conversation</button>
                <button className="msg__settings-btn">Block User</button>
                <button className="msg__settings-btn msg__settings-btn--danger">Report</button>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}