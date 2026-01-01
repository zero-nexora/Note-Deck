import { SettingTaps } from '@/components/setting/setting-layout'
import { requireAuth } from '@/lib/session'

const SetttingPage = async () => {
  const user = await requireAuth();

  if (!user) return null;

  return (
    <div>
      <SettingTaps user={user} />
    </div>
  )
}

export default SetttingPage