import { Edit2 } from 'lucide-react';

export default function Settings() {
    return (
        <div className="p-6 bg-[#0F1C2E] min-h-screen text-[#E0E1DD] flex flex-col items-center space-y-8">

            {/* General Settings Card */}
            <div className="bg-[#1B263B] p-8 rounded-3xl shadow-xl w-full max-w-5xl border border-[#415A77] hover:shadow-2xl transition-shadow duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <button className="bg-[#415A77] hover:bg-[#778DA9] p-2 rounded-full shadow-md transition-transform transform hover:scale-110">
                        <Edit2 className="w-5 h-5 text-[#E0E1DD]" />
                    </button>
                </div>



                {/* Preferences */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Preferences</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#415A77] p-4 rounded-xl hover:bg-[#778DA9] transition">
                            <p className="font-semibold">Language</p>
                            <p className="text-sm text-[#E0E1DD]/70">Select your preferred language for the interface.</p>
                        </div>
                        <div className="bg-[#415A77] p-4 rounded-xl hover:bg-[#778DA9] transition">
                            <p className="font-semibold">Region</p>
                            <p className="text-sm text-[#E0E1DD]/70">Set your region for content and formats.</p>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Notifications</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#415A77] p-4 rounded-xl hover:bg-[#778DA9] transition">
                            <p className="font-semibold">App Alerts</p>
                            <p className="text-sm text-[#E0E1DD]/70">Enable or disable notifications for updates and alerts.</p>
                        </div>
                        <div className="bg-[#415A77] p-4 rounded-xl hover:bg-[#778DA9] transition">
                            <p className="font-semibold">Email Alerts</p>
                            <p className="text-sm text-[#E0E1DD]/70">Receive emails about updates, offers, and promotions.</p>
                        </div>
                    </div>
                </div>

                {/* Integrations */}
                <div>
                    <h2 className="text-xl font-semibold mb-3">Integrations</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#415A77] p-4 rounded-xl hover:bg-[#778DA9] transition">
                            <p className="font-semibold">Connected Services</p>
                            <p className="text-sm text-[#E0E1DD]/70">Manage third-party apps connected to your account.</p>
                        </div>
                        <div className="bg-[#415A77] p-4 rounded-xl hover:bg-[#778DA9] transition">
                            <p className="font-semibold">API / Developer Access</p>
                            <p className="text-sm text-[#E0E1DD]/70">Configure API keys and integrations for developers.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
