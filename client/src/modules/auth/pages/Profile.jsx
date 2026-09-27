import { useAuthContext } from "../context/AuthProvider";
import { gradientFromString } from "../../shared/colorFromString";

const Profile = () => {
    const { user } = useAuthContext();
    const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "?";
    const gradient = gradientFromString(user?.name);

    return (
        <div className="mx-auto max-w-md">
            <div className="card-surface flex flex-col items-center gap-4 p-10 text-center">
                <div className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${gradient}`}>
                    <span className="font-display text-3xl font-medium text-white/90">{initial}</span>
                </div>

                <div>
                    <h1 className="font-display text-2xl font-semibold text-ink">{user?.name}</h1>
                    <p className="mt-1 text-sm text-ink/60">{user?.email}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
