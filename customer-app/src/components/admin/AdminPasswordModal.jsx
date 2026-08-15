import { useState } from "react";
import { adminAuthService } from "@/services/adminAuthService";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function AdminPasswordModal({
  action,
  onVerified,
  onCancel,
}) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Get current user email
    const user = await adminAuthService.getCurrentUser();

    if (!user) {
      setError("User not found. Please login again.");
      setIsLoading(false);
      return;
    }

    // Verify password
    const result = await adminAuthService.verifyPassword(user.email, password);

    if (result.success) {
      setPassword("");
      setAttemptCount(0);
      setIsLoading(false);
      onVerified();
    } else {
      const newAttempt = attemptCount + 1;
      setAttemptCount(newAttempt);

      if (newAttempt >= 3) {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError(
          result.error || `Incorrect password. (${3 - newAttempt} attempts left)`
        );
      }
      setIsLoading(false);
    }
  };

  const isLocked = attemptCount >= 3;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onCancel}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Lock size={24} className="text-msp-blue" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-charcoal">
                Confirm Admin Action
              </h3>
              <p className="text-sm text-gray-600">
                This operation requires verification
              </p>
            </div>
          </div>

          {/* Action Description */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-gray-700">{action}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-4">
            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Enter Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLocked || isLoading}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-msp-blue focus:border-transparent disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLocked || isLoading}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  isLocked
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                }`}
              >
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-charcoal rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isLocked || !password}
                className="flex-1 px-4 py-2 bg-msp-blue hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400"
              >
                {isLoading ? "Verifying..." : "Confirm"}
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Your password is never stored and only used for this verification.
          </p>
        </div>
      </div>
    </>
  );
}