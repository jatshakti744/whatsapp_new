import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Send,
  Paperclip,
  X,
  Info,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import {
  MSGSend,
  GetChatHistoryByPhone,
  GetActiveTemplateList,
} from "../../services/AdminServices";
import { Check, CheckCheck } from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "sonner";

// ✅ Template Modal Component (Extracted at top like Admin)
const TemplateModal = ({
  open,
  onClose,
  templates,
  loadingTemplates,
  selectedTemplate,
  setSelectedTemplate,
  templateParams,
  setTemplateParams,
  sending,
  sendTemplateMessage,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Select Template</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4">
          <select
            className="w-full border p-2 rounded"
            value={selectedTemplate?._id || ""}
            onChange={(e) => {
              const t = templates.find((x) => x._id === e.target.value);
              setSelectedTemplate(t);
              setTemplateParams("");
            }}
          >
            <option value="">-- Select Template --</option>
            {templates.map((t) => (
              <option key={t._id} value={t._id}>
                {t.template_name}
              </option>
            ))}
          </select>

          {selectedTemplate && (
            <>
              <textarea
                readOnly
                value={selectedTemplate.message}
                rows={5}
                className="w-full border p-2 bg-gray-50"
              />

              {/* ✅ autoFocus added */}
              <Input
                autoFocus
                value={templateParams}
                onChange={(e) => setTemplateParams(e.target.value)}
                placeholder="Ex: 1##2##3##4"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate parameters with ## (e.g., param1##param2##param3)
              </p>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!selectedTemplate || sending}
            onClick={sendTemplateMessage}
          >
            {sending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const WhatsappChat = () => {
  const { state } = useLocation();
  const client = state?.client;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);

  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateParams, setTemplateParams] = useState("");

  const bottomRef = useRef(null);
  const socketRef = useRef(null);
  const isFetchingRef = useRef(false);

  const token = localStorage.getItem("tokenjwt");
  const sender_id = localStorage.getItem("uid");

  useEffect(() => {
    const images = messages
      .filter((m) => m.message_type === "image" && m.media_url)
      .map((m) => ({
        url: m.media_url,
        id: m._id,
        time: m.createdAt,
      }));
    setAllImages(images);
  }, [messages]);

  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const res = await GetActiveTemplateList(token);
      setTemplates(res.data || []);
    } catch (err) {
      console.error("❌ Fetch templates error:", err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const fetchHistory = async (skipIfFetching = false) => {
    if (!client?.PhoneNo) return;

    if (skipIfFetching && isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const res = await GetChatHistoryByPhone(token, client.PhoneNo, sender_id);
      setMessages(res.data || []);
    } catch (err) {
      console.error("❌ Fetch history error:", err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  useEffect(() => {
    if (!client?.PhoneNo) return;

    fetchHistory();

    socketRef.current = io("https://apiwhatsapp.tradestreet.in:1001", {
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    socket.on("clientnotification", (data) => {


      if (!data) return;

      if (data.phone?.endsWith(client.PhoneNo)) {
        if (data.type === "whatsapp_chat") {

          fetchHistory(true);
        }

        if (data.type === "whatsapp_status") {

          setMessages((prev) => {
            const updated = prev.map((m) =>
              m._id === data.message_id
                ? {
                    ...m,
                    status: data.status,
                    whatsapp_msg_error: data.error || null,
                  }
                : m,
            );

            return updated;
          });
        }
      }
    });

    socket.on("connect", () => {
    });

    socket.on("disconnect", () => {
    });

    socket.on("error", (err) => {
      console.error("🔥 Socket error:", err);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [client?.PhoneNo, token, sender_id]);

  const sendMessage = async () => {
    if (!text && !file) return;

    setSending(true);

    try {
      const phoneNumber = client.PhoneNo.startsWith("91")
        ? client.PhoneNo
        : `91${client.PhoneNo}`;

      const formData = new FormData();
      formData.append("phone", phoneNumber);
      formData.append("sender_type", "employee");
      formData.append("sender_id", sender_id);
      formData.append("sendto", "1");
      formData.append("crm_user_id", sender_id);

      if (text) formData.append("message", text);
      if (file) formData.append("image", file);

      const response = await MSGSend(token, formData);

      setText("");
      setFile(null);

      // ✅ Better file type detection like Admin
      if (response.data?._id) {
        const newMsg = {
          _id: response.data._id,
          message: text,
          message_type: file
            ? file.type.startsWith("image/")
              ? "image"
              : file.type.startsWith("video/")
                ? "video"
                : "document"
            : "text",
          media_url:
            response.data.media_url ||
            (file?.type.startsWith("image/")
              ? URL.createObjectURL(file)
              : null),
          sendto: 1,
          status: "sent",
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMsg]);
      } else {
        setTimeout(() => fetchHistory(), 500);
      }
    } catch (err) {
      console.error("❌ Send message error:", err);
      fetchHistory();
    } finally {
      setSending(false);
    }
  };

  // ✅ Enhanced error handling like Admin
  const sendTemplateMessage = async () => {
    if (!selectedTemplate) return;

    setSending(true);

    try {
      const phoneNumber = client.PhoneNo.startsWith("91")
        ? client.PhoneNo
        : `91${client.PhoneNo}`;

      const formData = new FormData();
      formData.append("phone", phoneNumber);
      formData.append("message", selectedTemplate.message);
      formData.append("message_type", "template");
      formData.append("sender_type", "employee");
      formData.append("sender_id", sender_id);
      formData.append("sendto", "1");
      formData.append("is_template", "true");
      formData.append("template_name", selectedTemplate.template_name);
      formData.append("crm_user_id", sender_id);

      if (templateParams.trim()) {
        formData.append("template_params", templateParams);
      }

      const res = await MSGSend(token, formData);

      if (res?.status === false) {
        toast.error("Failed to send template");
        setSending(false);
        return;
      }

      if (res?.status === 500) {
        toast.error("Failed to send template");
        setSending(false);
        return;
      }

      setTemplateModalOpen(false);
      setSelectedTemplate(null);
      setTemplateParams("");

      setTimeout(fetchHistory, 300);
    } catch (err) {
      console.error("❌ Template send error:", err);
      toast.error(err?.response?.data?.message || "WhatsApp message failed");
    } finally {
      setSending(false);
    }
  };

  const openTemplateModal = () => {
    setTemplateModalOpen(true);
    fetchTemplates();
  };

  const openLightbox = (imageUrl) => {
    const imageIndex = allImages.findIndex((img) => img.url === imageUrl);
    if (imageIndex !== -1) {
      setCurrentImageIndex(imageIndex);
      setLightboxOpen(true);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length,
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;

      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setLightboxOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, allImages.length]);

  const MessageStatusIcon = ({ status }) => {
    switch (status) {
      case "sent":
        return <Check size={14} className="text-gray-400" />;
      case "delivered":
        return <CheckCheck size={14} className="text-gray-400" />;
      case "read":
        return <CheckCheck size={14} className="text-blue-500" />;
      default:
        return null;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getDateLabel = (dateString) => {
    if (!dateString) return "";

    const msgDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    msgDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);

    if (msgDate.getTime() === today.getTime()) {
      return "Today";
    } else if (msgDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  };

  const shouldShowDateSeparator = (currentMsg, previousMsg) => {
    if (!previousMsg) return true;

    const currentDate = new Date(currentMsg.createdAt).toDateString();
    const previousDate = new Date(previousMsg.createdAt).toDateString();

    return currentDate !== previousDate;
  };

  const MediaRenderer = ({ msg }) => {
    if (msg.message_type === "image") {
      return msg.media_url ? (
        <img
          src={msg.media_url}
          alt="Shared image"
          onClick={() => openLightbox(msg.media_url)}
          className="rounded mb-1 max-w-[240px] max-h-[300px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
        />
      ) : (
        <div className="w-[200px] h-[150px] bg-gray-200 rounded mb-1 flex items-center justify-center text-gray-500 text-xs">
          🖼️ Photo
        </div>
      );
    }

    if (msg.message_type === "video") {
      return msg.media_url ? (
        <video
          src={msg.media_url}
          controls
          className="rounded mb-1 max-w-[240px] max-h-[300px]"
        />
      ) : (
        <div className="w-[240px] h-[150px] bg-black rounded mb-1 flex items-center justify-center text-white text-xs">
          ▶️ Video
        </div>
      );
    }

    if (msg.message_type === "document") {
      const fileName =
        msg.media_url?.split("/").pop() || msg.caption || "Document";

      return (
        <a
          href={msg.media_url || "#"}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 bg-[#f0f2f5] p-3 rounded mb-1 w-[260px] hover:bg-gray-200 transition-colors"
        >
          <div className="w-10 h-10 bg-red-500 rounded flex items-center justify-center text-white text-lg">
            📄
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium break-all leading-tight">
              {fileName}
            </p>
            <p className="text-[11px] text-gray-500">Document</p>
          </div>
        </a>
      );
    }

    if (msg.message_type === "audio") {
      return msg.media_url ? (
        <audio src={msg.media_url} controls className="w-[240px]" />
      ) : (
        <div className="w-[200px] h-[50px] bg-gray-200 rounded mb-1 flex items-center justify-center text-gray-500 text-xs">
          🎵 Audio
        </div>
      );
    }

    return null;
  };

  const ImageLightbox = () => {
    if (!lightboxOpen || allImages.length === 0) return null;

    const currentImage = allImages[currentImageIndex];

    return (
      <div
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
        onClick={() => setLightboxOpen(false)}
      >
        <button
          onClick={() => setLightboxOpen(false)}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
        >
          <X size={32} />
        </button>

        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
          {currentImageIndex + 1} / {allImages.length}
        </div>

        {allImages.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 text-white hover:text-gray-300 bg-black/50 p-3 rounded-full"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        <img
          src={currentImage.url}
          alt="Full size"
          onClick={(e) => e.stopPropagation()}
          className="max-w-[90vw] max-h-[90vh] object-contain"
        />

        {allImages.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 text-white hover:text-gray-300 bg-black/50 p-3 rounded-full"
          >
            <ChevronRight size={32} />
          </button>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
          {formatTime(currentImage.time)}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          title={`${client?.FullName || ""}`}
          subtitle={`${client?.PhoneNo}`}
        />

        {/* CHAT AREA */}
        <div className="flex-1 p-4 overflow-auto bg-[#efeae2]">
          {loading && messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((m, index) => {
              const isMe = m.sendto == 1;
              const showText = m.message && m.message !== "null";
              const showCaption = m.caption && m.caption !== "null";
              const showDateSeparator = shouldShowDateSeparator(
                m,
                messages[index - 1],
              );

              return (
                <div key={m._id}>
                  {showDateSeparator && (
                    <div className="flex justify-center my-4">
                      <div className="bg-white/90 px-4 py-1 rounded-full shadow-sm text-xs text-gray-600 font-medium">
                        {getDateLabel(m.createdAt)}
                      </div>
                    </div>
                  )}

                  <div
                    className={`flex mb-2 ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg max-w-[60%] text-sm shadow
                      ${
                        isMe
                          ? "bg-[#dcf8c6] rounded-br-none"
                          : "bg-white rounded-bl-none"
                      }`}
                    >
                      <MediaRenderer msg={m} />

                      {showText && (
                        <p className="whitespace-pre-wrap break-words">
                          {m.message}
                        </p>
                      )}

                      {showCaption && (
                        <p className="text-xs text-gray-600 mt-1">
                          {m.caption}
                        </p>
                      )}

                      <div className="flex justify-end items-center gap-1 mt-1 text-[11px] text-gray-500">
                        <span>{formatTime(m.createdAt)}</span>

                        {isMe &&
                          (m.whatsapp_msg_error ? (
                            <div className="relative group">
                              <Info
                                size={14}
                                className="text-red-500 cursor-pointer"
                              />
                              <div
                                className="absolute bottom-full right-0 mb-1 w-64
                                bg-black text-white text-[11px] px-2 py-1 rounded
                                opacity-0 group-hover:opacity-100 transition
                                pointer-events-none z-50"
                              >
                                {m.whatsapp_msg_error}
                              </div>
                            </div>
                          ) : (
                            <MessageStatusIcon status={m.status} />
                          ))}
                      </div>

                      {m.status === "failed" && (
                        <div className="mt-1 text-xs text-red-600 bg-red-100 p-2 rounded">
                          ❌ {m.whatsapp_msg_error || "Message failed to send"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT AREA */}
        <div className="p-3 border-t flex gap-2 items-center bg-white">
          <label className="cursor-pointer hover:text-blue-600 transition-colors">
            <Paperclip size={18} />
            <input
              type="file"
              hidden
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          <button
            onClick={openTemplateModal}
            className="cursor-pointer hover:text-blue-600 transition-colors"
            title="Send Template"
          >
            <FileText size={18} />
          </button>

          {file && (
            <div className="relative mb-2 max-w-[120px]">
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="rounded shadow"
                />
              ) : (
                <div className="bg-gray-200 p-2 rounded text-sm">
                  {file.name}
                </div>
              )}

              <button
                onClick={() => setFile(null)}
                className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 hover:bg-gray-100"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <Input
            value={text}
            placeholder="Type a message"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={sending}
            className="flex-1"
          />

          <Button
            onClick={sendMessage}
            disabled={sending || (!text && !file)}
            className="px-4"
          >
            {sending ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <Send size={16} />
            )}
          </Button>
        </div>
      </div>

      {/* ✅ Template Modal (same props as Admin) */}
      <TemplateModal
        open={templateModalOpen}
        onClose={() => {
          setTemplateModalOpen(false);
          setSelectedTemplate(null);
          setTemplateParams("");
        }}
        templates={templates}
        loadingTemplates={loadingTemplates}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        templateParams={templateParams}
        setTemplateParams={setTemplateParams}
        sending={sending}
        sendTemplateMessage={sendTemplateMessage}
      />

      <ImageLightbox />
    </div>
  );
};

export default WhatsappChat;
