"use client";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticketCount, setTicketCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketData, setTicketData] = useState({
    name: "",
    email: "",
    issue: "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const commonIssues = [
    "🔐 Password reset",
    "🌐 VPN connection",
    "🖨️ Printer not working",
    "📧 Email not syncing",
    "🐌 Slow computer",
    "📶 Internet issues",
    "💿 Software install",
    "🖥️ Screen problems",
  ];

  const sendMessage = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage = { role: "user", content: textToSend };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          resolved: data.resolved,
        },
      ]);

      if (data.resolved) {
        setResolvedCount((prev) => prev + 1);
      } else if (data.ticketCreated) {
        setTicketCount((prev) => prev + 1);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error connecting to support system. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleQuickIssue = (issue) => {
    sendMessage(issue);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    const ticketNumber = Math.floor(100000 + Math.random() * 900000);
    alert(
      "Ticket created! Number: " +
        ticketNumber +
        "\n\nName: " +
        ticketData.name +
        "\nEmail: " +
        ticketData.email +
        "\n\nOur IT team will contact you within 4 hours.",
    );
    setShowTicketForm(false);
    setTicketData({ name: "", email: "", issue: "" });
    setTicketCount((prev) => prev + 1);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "#f3f4f6",
        }}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: "fixed",
            top: "15px",
            left: "15px",
            zIndex: 1001,
            padding: "10px 15px",
            backgroundColor: "#0071c5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "18px",
            display: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
          className="mobile-menu-btn"
        >
          ☰
        </button>

        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 998,
              display: "none",
            }}
            className="mobile-overlay"
          />
        )}

        <div
          className={sidebarOpen ? "sidebar sidebar-open" : "sidebar"}
          style={{
            width: "300px",
            backgroundColor: "#0071c5",
            color: "white",
            padding: "30px 20px",
            boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
            position: "fixed",
            height: "100vh",
            overflowY: "auto",
            zIndex: 999,
            transition: "left 0.3s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
              🛠️ IT Helpdesk
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                display: "none",
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "24px",
                cursor: "pointer",
              }}
              className="close-btn"
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <h3
              style={{
                fontSize: "12px",
                marginBottom: "15px",
                opacity: 0.9,
                letterSpacing: "1px",
              }}
            >
              QUICK SOLUTIONS
            </h3>
            {commonIssues.map((issue, i) => (
              <button
                key={i}
                onClick={() => handleQuickIssue(issue)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  marginBottom: "8px",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  textAlign: "left",
                  transition: "all 0.2s",
                  fontWeight: "500",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "rgba(255,255,255,0.2)")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
                }
              >
                {issue}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setShowTicketForm(true);
              if (window.innerWidth <= 768) setSidebarOpen(false);
            }}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            📝 Create Support Ticket
          </button>

          <div
            style={{
              marginTop: "40px",
              padding: "20px",
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: "12px",
            }}
          >
            <h3
              style={{
                fontSize: "12px",
                marginBottom: "20px",
                opacity: 0.9,
                letterSpacing: "1px",
              }}
            >
              📊 TODAY STATS
            </h3>
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{ fontSize: "11px", opacity: 0.8, marginBottom: "5px" }}
              >
                Auto-Resolved
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#10b981",
                }}
              >
                {resolvedCount}
              </div>
            </div>
            <div>
              <div
                style={{ fontSize: "11px", opacity: 0.8, marginBottom: "5px" }}
              >
                Tickets Created
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#fbbf24",
                }}
              >
                {ticketCount}
              </div>
            </div>
            <div
              style={{
                marginTop: "15px",
                padding: "10px",
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: "6px",
                fontSize: "11px",
              }}
            >
              ⚡ Avg. Resolution: <strong>30 seconds</strong>
            </div>
          </div>
        </div>

        <div
          style={{ flex: 1, padding: "30px", marginLeft: "300px" }}
          className="main-content"
        >
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ marginBottom: "30px", textAlign: "center" }}>
              <h1
                style={{
                  color: "#0071c5",
                  fontSize: "36px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                Intel IT Support Assistant
              </h1>
              <p style={{ color: "#6b7280", fontSize: "16px" }}>
                Get instant help with common IT issues • Available 24/7
              </p>
            </div>

            <div
              style={{
                minHeight: "500px",
                maxHeight: "500px",
                overflowY: "auto",
                border: "1px solid #e5e7eb",
                padding: "25px",
                marginBottom: "20px",
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              }}
            >
              {messages.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    color: "#9ca3af",
                    marginTop: "150px",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "20px" }}>
                    👋
                  </div>
                  <h3
                    style={{
                      fontSize: "24px",
                      marginBottom: "10px",
                      color: "#374151",
                    }}
                  >
                    Hello! How can I help you?
                  </h3>
                  <p style={{ fontSize: "14px" }}>
                    Select a quick issue from the sidebar or type your question
                    below
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: "20px",
                    padding: "18px 20px",
                    backgroundColor:
                      msg.role === "user" ? "#eff6ff" : "#f9fafb",
                    borderRadius: "12px",
                    borderLeft:
                      msg.role === "user"
                        ? "4px solid #0071c5"
                        : "4px solid #10b981",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <strong
                    style={{
                      color: msg.role === "user" ? "#0071c5" : "#059669",
                      fontSize: "14px",
                    }}
                  >
                    {msg.role === "user" ? "👤 You" : "🤖 IT Assistant"}
                  </strong>
                  <div
                    style={{
                      whiteSpace: "pre-wrap",
                      marginTop: "10px",
                      lineHeight: "1.7",
                      color: "#374151",
                      fontSize: "15px",
                    }}
                  >
                    {msg.content}
                  </div>
                  {msg.resolved && (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "8px 12px",
                        backgroundColor: "#d1fae5",
                        borderRadius: "6px",
                        color: "#059669",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      ✅ Issue resolved automatically
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "15px",
                  }}
                >
                  <div className="spinner"></div>
                  <span style={{ color: "#6b7280", fontSize: "14px" }}>
                    Assistant is typing...
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Describe your IT issue... (e.g., I forgot my password)"
                style={{
                  flex: 1,
                  padding: "18px 20px",
                  fontSize: "16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0071c5")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading}
                style={{
                  padding: "18px 35px",
                  backgroundColor: loading ? "#9ca3af" : "#0071c5",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
                onMouseOver={(e) =>
                  !loading && (e.target.style.backgroundColor = "#005a9e")
                }
                onMouseOut={(e) =>
                  !loading && (e.target.style.backgroundColor = "#0071c5")
                }
              >
                Send
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginTop: "30px",
              }}
            >
              <div
                style={{
                  padding: "20px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "5px",
                  }}
                >
                  AVG. RESOLUTION TIME
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#0071c5",
                  }}
                >
                  30 sec
                </div>
              </div>
              <div
                style={{
                  padding: "20px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "5px",
                  }}
                >
                  COST SAVINGS
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#10b981",
                  }}
                >
                  $200K/yr
                </div>
              </div>
              <div
                style={{
                  padding: "20px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    marginBottom: "5px",
                  }}
                >
                  AUTO-RESOLUTION RATE
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#f59e0b",
                  }}
                >
                  70%
                </div>
              </div>
            </div>
          </div>
        </div>

        {showTicketForm && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1002,
              padding: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "40px",
                borderRadius: "16px",
                width: "500px",
                maxWidth: "100%",
                boxShadow: "0 20px 25px rgba(0,0,0,0.3)",
              }}
            >
              <h2
                style={{
                  marginBottom: "10px",
                  color: "#0071c5",
                  fontSize: "28px",
                }}
              >
                Create Support Ticket
              </h2>
              <p
                style={{
                  marginBottom: "25px",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Our IT team will respond within 4 hours
              </p>
              <form onSubmit={handleTicketSubmit}>
                <input
                  required
                  placeholder="Your Full Name"
                  value={ticketData.name}
                  onChange={(e) =>
                    setTicketData({ ...ticketData, name: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginBottom: "15px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
                <input
                  required
                  type="email"
                  placeholder="Work Email Address"
                  value={ticketData.email}
                  onChange={(e) =>
                    setTicketData({ ...ticketData, email: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginBottom: "15px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
                <textarea
                  required
                  placeholder="Describe your issue in detail..."
                  value={ticketData.issue}
                  onChange={(e) =>
                    setTicketData({ ...ticketData, issue: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "14px",
                    marginBottom: "25px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "16px",
                    minHeight: "120px",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: "14px",
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Submit Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTicketForm(false)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      backgroundColor: "#6b7280",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
