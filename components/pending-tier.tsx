import { CircleHelp } from 'lucide-react';

export function PendingTier({className=''}:{className?:string}) {
  return <span className={`tier-badge tier-pending ${className}`} role="img" aria-label="평가 대기 · 아직 투표가 없습니다" title="평가 대기 · 아직 투표가 없습니다"><CircleHelp size={18} aria-hidden="true"/></span>;
}
