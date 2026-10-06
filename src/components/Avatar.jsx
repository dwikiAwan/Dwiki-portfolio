import { AVATARS } from '../data/avatars';

export default function Avatar({ id, className = 'w-4 h-4' }) {
    const Icon = (AVATARS.find((a) => a.id === id) || AVATARS[0]).icon;
    return <Icon className={className} />;
}
