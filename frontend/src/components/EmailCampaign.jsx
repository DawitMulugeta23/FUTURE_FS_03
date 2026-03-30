import { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Users, Mail, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const EmailCampaign = () => {
  const [emailForm, setEmailForm] = useState({
    subject: '',
    message: '',
    userFilter: 'all'
  });
  const [sending, setSending] = useState(false);
  const [preview, setPreview] = useState(false);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    fetchUserCount();
  }, [emailForm.userFilter]);

  const fetchUserCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `http://localhost:5000/api/admin/users/count?filter=${emailForm.userFilter}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserCount(data.count);
    } catch (err) {
      console.error('Error fetching user count', err);
    }
  };

  const handleSendCampaign = async (e) => {
    e.preventDefault();
    
    if (!emailForm.subject.trim() || !emailForm.message.trim()) {
      toast.error('Please fill in subject and message');
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/admin/email/campaign',
        emailForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Email campaign sent to ${userCount} users!`);
      setEmailForm({ subject: '', message: '', userFilter: 'all' });
      setPreview(false);
    } catch (err) {
      toast.error('Failed to send email campaign');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Mail className="text-amber-600" /> Email Campaign
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Email Form */}
        <div>
          <form onSubmit={handleSendCampaign} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Filter
              </label>
              <select
                value={emailForm.userFilter}
                onChange={(e) => setEmailForm({ ...emailForm, userFilter: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">All Users ({userCount})</option>
                <option value="customers">Customers Only</option>
                <option value="active">Active Users (last 30 days)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter email subject"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                rows={8}
                value={emailForm.message}
                onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="Write your message here..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="px-4 py-2 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition"
              >
                {preview ? 'Hide Preview' : 'Preview'}
              </button>
              <button
                type="submit"
                disabled={sending}
                className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Send Campaign
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        {preview && (
          <div className="border-l-2 border-amber-200 pl-6">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Mail size={18} /> Email Preview
            </h4>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-amber-600 p-3 text-white">
                  <h3 className="font-bold">Yesekela Café</h3>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2">{emailForm.subject || 'Subject'}</h4>
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {emailForm.message || 'Your message will appear here...'}
                  </div>
                  <div className="mt-4 pt-3 border-t text-sm text-gray-500">
                    <p>Best regards,</p>
                    <p className="font-bold">Yesekela Café Team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-amber-50 rounded-xl">
        <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
          <AlertCircle size={18} /> Email Tips
        </h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Keep subject lines clear and engaging</li>
          <li>• Personalize messages when possible</li>
          <li>• Include a clear call-to-action</li>
          <li>• Avoid spammy language</li>
          <li>• Test emails before sending to large lists</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailCampaign;