import {
    Zap, Palette, Wrench, FileCode2, Bot, Smartphone, Sparkles,
    Cloud, Globe, Plug, CircleHelp,
} from 'lucide-react';

const ICONS = {
    zap: Zap,
    palette: Palette,
    wrench: Wrench,
    code: FileCode2,
    bot: Bot,
    smartphone: Smartphone,
    sparkles: Sparkles,
    cloud: Cloud,
    globe: Globe,
    plug: Plug,
};

/** Mengembalikan komponen icon**/
export function getIcon(name) {
    return ICONS[name] || CircleHelp;
}

export default ICONS;
