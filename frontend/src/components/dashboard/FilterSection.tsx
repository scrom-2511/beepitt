import { getAllGroupsHandler } from '@/requestHandler/settings/project/getAllGroups.reqhandler';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
// ── Types derived from Prisma schema ──────────────────────────────────────────
type Priority = 'Critical' | 'High' | 'Low';
type Environment = 'production' | 'staging' | 'development' | 'qa' | 'uat' | 'sandbox';

const PRIORITY_OPTIONS: { label: Priority; color: string }[] = [
  { label: 'Critical', color: 'bg-red-600' },
  { label: 'High', color: 'bg-red-400' },
  { label: 'Low', color: 'bg-yellow-500' },
];

// Mirrors the Environment enum in schema.prisma
const ENVIRONMENT_OPTIONS: Environment[] = ['production', 'staging', 'development', 'qa', 'uat', 'sandbox'];

const FilterSection = ({
  showPriority,
  showEnvironment,
  showGroup,
}: {
  showPriority: boolean;
  showEnvironment: boolean;
  showGroup: boolean;
}) => {
  const [priority, setPriority] = useState<Priority | null>(null);
  const [environment, setEnvironment] = useState<Environment | null>(null);
  // group is dynamic at runtime; null means "all groups"
  const [group, setGroup] = useState<string | null>(null);

  const { data: groupsData, isLoading: isGroupsLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: getAllGroupsHandler,
  });

  const availableGroups = groupsData?.groups ?? [];

  const tier = localStorage.getItem('userSubscriptionTier'); // 'free' | 'starter' | 'pro'

  // free -> no filters at all
  if (tier === 'free' || !tier) return null;

  // starter -> only priority & environment; pro → everything
  const canShowPriority = showPriority && (tier === 'starter' || tier === 'pro');
  const canShowEnvironment = showEnvironment && (tier === 'starter' || tier === 'pro');
  const canShowGroup = showGroup && tier === 'pro';

  // nothing left to show (e.g. caller passed all-false or tier unknown)
  if (!canShowPriority && !canShowEnvironment && !canShowGroup) return null;

  return (
    <section className="w-full flex">
      <div className="flex flex-wrap gap-2 p-5">
        {/* ── Priority dropdown ── */}
        {canShowPriority && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md border border-border bg-background text-sm font-medium text-foreground cursor-pointer hover:bg-accent transition-colors">
                {priority ? (
                  <>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        priority === 'Critical' ? 'bg-red-600' : priority === 'High' ? 'bg-red-400' : 'bg-yellow-500'
                      }`}
                    />
                    {priority}
                    <X
                      className="ml-1 size-3.5 text-muted-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPriority(null);
                      }}
                    />
                  </>
                ) : (
                  <>
                    Priority <ChevronDown className="size-3.5 text-muted-foreground" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {PRIORITY_OPTIONS.map(({ label, color }) => (
                <DropdownMenuItem
                  key={label}
                  onClick={() => setPriority(label)}
                  className={priority === label ? 'bg-accent' : ''}
                >
                  <span className={`h-2 w-2 rounded-full ${color}`} />
                  {label}
                </DropdownMenuItem>
              ))}
              {priority && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setPriority(null)} className="text-muted-foreground">
                    <X className="size-3.5" /> Clear
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* ── Environment dropdown ── */}
        {canShowEnvironment && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md border border-border bg-background text-sm font-medium text-foreground cursor-pointer hover:bg-accent transition-colors capitalize">
                {environment ? (
                  <>
                    {environment}
                    <X
                      className="ml-1 size-3.5 text-muted-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEnvironment(null);
                      }}
                    />
                  </>
                ) : (
                  <>
                    Environment <ChevronDown className="size-3.5 text-muted-foreground" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Environment</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ENVIRONMENT_OPTIONS.map((env) => (
                <DropdownMenuItem
                  key={env}
                  onClick={() => setEnvironment(env)}
                  className={`capitalize ${environment === env ? 'bg-accent' : ''}`}
                >
                  {env}
                </DropdownMenuItem>
              ))}
              {environment && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setEnvironment(null)} className="text-muted-foreground">
                    <X className="size-3.5" /> Clear
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* ── Group dropdown (dynamic) ── */}
        {canShowGroup && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-2 h-8 px-3 rounded-md border border-border bg-background text-sm font-medium text-foreground cursor-pointer hover:bg-accent transition-colors">
                {group ? (
                  <>
                    {group}
                    <X
                      className="ml-1 size-3.5 text-muted-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        setGroup(null);
                      }}
                    />
                  </>
                ) : isGroupsLoading ? (
                  <span className="text-muted-foreground">Loading…</span>
                ) : (
                  <>
                    Group <ChevronDown className="size-3.5 text-muted-foreground" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Group</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableGroups.length === 0 ? (
                <DropdownMenuItem disabled className="text-muted-foreground text-xs">
                  No groups found
                </DropdownMenuItem>
              ) : (
                availableGroups.map((g) => (
                  <DropdownMenuItem key={g} onClick={() => setGroup(g)} className={group === g ? 'bg-accent' : ''}>
                    {g}
                  </DropdownMenuItem>
                ))
              )}
              {group && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setGroup(null)} className="text-muted-foreground">
                    <X className="size-3.5" /> Clear
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </section>
  );
};

export default FilterSection;
