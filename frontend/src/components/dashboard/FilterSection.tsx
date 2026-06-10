import { getAllGroupsHandler } from '@/requestHandler/settings/project/getAllGroups.reqhandler';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Environment, IssuePriority } from '@/types/enums';

const PRIORITY_OPTIONS: { label: IssuePriority; color: string }[] = [
  { label: 'critical', color: 'bg-red-600' },
  { label: 'high', color: 'bg-red-400' },
  { label: 'low', color: 'bg-yellow-500' },
];

const ENVIRONMENT_OPTIONS = Environment;

const FilterSection = ({
  showPriority,
  showEnvironment,
  showGroup,
  priority,
  setPriority,
  environment,
  setEnvironment,
  group,
  setGroup,
}: {
  showPriority: boolean;
  showEnvironment: boolean;
  showGroup: boolean;
  priority: IssuePriority | null;
  setPriority: (priority: IssuePriority | null) => void;
  environment: Environment | null;
  setEnvironment: (environment: Environment | null) => void;
  group: string | null;
  setGroup: (group: string | null) => void;
}) => {
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
                      className={`h-2 w-2 rounded-full ${priority === 'critical' ? 'bg-red-600' : priority === 'high' ? 'bg-red-400' : 'bg-yellow-500'
                        }`}
                    />
                    <span className="capitalize">{priority}</span>
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
                  className={`capitalize ${priority === label ? 'bg-accent' : ''}`}
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
