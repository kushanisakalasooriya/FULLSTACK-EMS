import { useEffect, useState } from "react"
import { dummyProfileData } from "../assets/assets"
import Loading from "../components/Loading"
import { Lock } from "lucide-react"
import ProfileForm from "../components/ProfileForm"
import ChangePasswordModel from "../components/ChangePasswordModel"

const Settings = () => {

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPasswordModel, setShowPasswordModel] = useState(false)
  const fetchProfile = async() => {
    setProfile(dummyProfileData)
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if(loading) {
    return <Loading />
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Welcome to your settings page!</p>
      </div>

      {profile && <ProfileForm initialData={profile} onSuccess={fetchProfile}/>}

      {/* change password */}
      <div className="card max-w-md p-6 flex items-center gap-4 sm:gap-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="p-2.5 bg-slate-100 rounded-lg">
            <Lock className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">Password</p>
            <p className="text-sm text-slate-500">Change your account password regularly to keep your account secure.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowPasswordModel(true)}
          className="btn-secondary shrink-0 text-sm"
        >
          Change
        </button>
      </div>
      <ChangePasswordModel open={showPasswordModel} onClose={() => setShowPasswordModel(false)}/>
    </div>
  )
}

export default Settings