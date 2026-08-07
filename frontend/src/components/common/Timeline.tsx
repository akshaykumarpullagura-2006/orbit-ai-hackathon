import { motion } from 'framer-motion';
import { StatusBadge } from './Badges';
import type { ActivityItem } from '@/types';

export function Timeline({ items }: { items: ActivityItem[] }) {
  return (
    <div className="relative">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
      <div className="space-y-5">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="relative pl-6"
          >
            <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background" />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm">
                <span className="font-medium text-foreground">{item.agent}</span>
                <span className="text-muted-foreground"> {item.action} </span>
                <span className="font-medium text-primary">{item.target}</span>
              </p>
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{item.time}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
