import React, { useState } from 'react';
import { ArrowLeft, Mail, Plus, Trash2, Check, X, AlertCircle, Send, Shield } from 'lucide-react';

interface EmailManagementProps {
  onBack: () => void;
}

interface EmailAddress {
  id: number;
  email: string;
  isPrimary: boolean;
  isVerified: boolean;
}

export default function EmailManagement({ onBack }: EmailManagementProps) {
  const [emails, setEmails] = useState<EmailAddress[]>([
    { id: 1, email: 'admin@nutriai.com', isPrimary: true, isVerified: true },
    { id: 2, email: 'backup@gmail.com', isPrimary: false, isVerified: true },
    { id: 3, email: 'work@company.com', isPrimary: false, isVerified: false }
  ]);

  const [newEmail, setNewEmail] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail.trim()) {
      setError('Please enter an email address.');
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (emails.some(email => email.email === newEmail)) {
      setError('This email address is already added.');
      return;
    }

    const newEmailObj: EmailAddress = {
      id: Date.now(),
      email: newEmail,
      isPrimary: false,
      isVerified: false
    };

    setEmails([...emails, newEmailObj]);
    setNewEmail('');
    setShowAddForm(false);
    setError('');
    setSuccess('Email added successfully! Verification email sent.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleRemoveEmail = (id: number) => {
    const emailToRemove = emails.find(email => email.id === id);
    if (emailToRemove?.isPrimary) {
      setError('Cannot remove primary email address.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setEmails(emails.filter(email => email.id !== id));
    setSuccess('Email removed successfully.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSetPrimary = (id: number) => {
    const targetEmail = emails.find(email => email.id === id);
    if (!targetEmail?.isVerified) {
      setError('Cannot set unverified email as primary.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setEmails(emails.map(email => ({
      ...email,
      isPrimary: email.id === id
    })));
    setSuccess('Primary email updated successfully.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleResendVerification = (id: number) => {
    setSuccess('Verification email sent successfully.');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 font-sans">
      {/* Enhanced Aurora Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/30 via-cyan-400/40 to-blue-600/30 transform rotate-12 scale-150 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-cyan-300/25 via-blue-400/35 to-indigo-500/25 transform -rotate-12 scale-150 animate-pulse delay-1000"></div>
        </div>

        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/60 via-cyan-300/70 to-blue-500/60 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400/50 via-blue-300/60 to-indigo-400/50 rounded-full blur-3xl animate-bounce delay-1000"></div>
        </div>

        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-blue-300 rounded-full opacity-70 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-20 p-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-3 text-white hover:text-cyan-300 transition-all duration-300 group"
        >
          <div className="relative">
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-400/40 via-cyan-400/50 to-blue-500/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/30 via-blue-400/40 to-cyan-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 flex items-center gap-3 transform group-hover:scale-105 transition-all duration-300 shadow-lg group-hover:shadow-cyan-500/30">
              <ArrowLeft className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300 group-hover:animate-pulse" />
              <span className="text-lg font-semibold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                Back to Settings
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-green-400/50 to-emerald-400/50 rounded-xl blur-lg animate-pulse"></div>
            <div className="relative bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3">
              <Check className="w-5 h-5" />
              {success}
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-red-400/50 to-pink-400/50 rounded-xl blur-lg animate-pulse"></div>
            <div className="relative bg-red-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 py-4">
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-400/40 via-emerald-300/50 to-green-500/40 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-4">
                <Mail className="w-12 h-12 text-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4">
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent">
              Email Management
            </span>
          </h1>
          <p className="text-blue-200 text-lg">Manage your email addresses and verification status</p>
        </div>

        {/* Main Content Container */}
        <div className="relative">
          <div className="absolute -inset-3 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 rounded-3xl blur-lg opacity-40 animate-pulse delay-500"></div>
          
          <div className="relative bg-white/95 backdrop-blur-3xl border-2 border-green-200/60 rounded-3xl p-8 shadow-2xl shadow-emerald-500/20">
            
            {/* Add Email Button */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Mail className="w-6 h-6 text-green-500" />
                Your Email Addresses
              </h3>
              
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  Add Email
                </button>
              )}
            </div>

            {/* Add Email Form */}
            {showAddForm && (
              <div className="mb-6 p-4 border-2 border-green-200 rounded-xl bg-green-50/50">
                <form onSubmit={handleAddEmail} className="space-y-4">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-300"></div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-green-500 group-focus-within:text-emerald-500 transition-colors" />
                      </div>
                      <input
                        type="email"
                        placeholder="Enter new email address"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/90 border-2 border-green-200 rounded-xl text-green-900 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setNewEmail('');
                        setError('');
                      }}
                      className="px-6 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Email List */}
            <div className="space-y-4">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                    email.isPrimary 
                      ? 'bg-blue-50/80 border-blue-300 shadow-lg shadow-blue-500/20' 
                      : 'bg-gray-50/80 border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`relative p-2 rounded-full ${
                        email.isPrimary ? 'bg-blue-200' : 'bg-gray-200'
                      }`}>
                        <Mail className={`w-5 h-5 ${
                          email.isPrimary ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-gray-800">{email.email}</p>
                          
                          {email.isPrimary && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Primary
                            </span>
                          )}
                          
                          {email.isVerified ? (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Unverified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!email.isVerified && (
                        <button
                          onClick={() => handleResendVerification(email.id)}
                          className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          Verify
                        </button>
                      )}
                      
                      {!email.isPrimary && email.isVerified && (
                        <button
                          onClick={() => handleSetPrimary(email.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                        >
                          Set Primary
                        </button>
                      )}
                      
                      {!email.isPrimary && (
                        <button
                          onClick={() => handleRemoveEmail(email.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50/80 border-2 border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Email Security Tips</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Your primary email is used for important account notifications</li>
                    <li>• Verify new email addresses to ensure account security</li>
                    <li>• You can have multiple verified emails for backup access</li>
                    <li>• Cannot remove your primary email address</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}