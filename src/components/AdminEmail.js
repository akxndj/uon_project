import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import "../styles/organizer.css";


function AdminEmail()
{
    const { push } = useToast();
    const { id } = useParams();
    const navigate = useNavigate();

    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const sender = async() => 
    {
        setLoading(true);
        try
        {
            const res = await fetch(`http://localhost:9999/api/registrations/${id}/emailOrg`, 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({subject, message}),
            });
            const data = await res.json();
            if(!res.ok) throw new Error(data.message);
            if (data.previewUrl) 
            {
                window.open(data.previewUrl, "_blank");
            }
            navigate(`/events/${id}`);

        }
        catch(error)
        {
            console.error("Failed to send email", error);
        }
        finally
        {
            setLoading(false);
        }
    }
    return (
    <div className="organizer-page">
        <div className="organizer-dashboard">
            
            <section className="organizer-section">
            <div className="organizer-section__header">
                <h2>Email Attendees</h2>
            </div>

            <div className="organizer-wizard">
                <div className="wizard-panel">
                
                <form onSubmit={sender} className="wizard-panel">
                    
                    <div className="input">
                    <label>Subject</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter email subject..."
                        required
                    />
                    </div>

                    <div>
                    <label>Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message..."
                        required
                    />
                    </div>

                    <div className="wizard-actions" style={{display: "flex", flexWrap: "nowrap"}}>
                    <button type="submit" className="btn btn--secondary">
                        {loading ? "Sending..." : "Send Email"}
                    </button>
                    <button
                        className="btn btn--secondary"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                    </div>

                </form>

                </div>
            </div>
            </section>

        </div>
    </div>
  );

}
export default AdminEmail;