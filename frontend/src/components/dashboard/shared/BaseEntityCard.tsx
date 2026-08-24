import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { BaseEntity } from '@/types/entities';
import { Calendar, Hash, Terminal } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardFooter } from '../../ui/card';
import CardAnimation from '../CardAnimation';
import CardHeaderComp from '../CardHeader';

interface BaseEntityCardProps {
  entity: BaseEntity;
  index: number;
  footer?: React.ReactNode;
  dialogExtraContent?: React.ReactNode;
  cardExtraContent?: React.ReactNode;
  showDefaultDates?: boolean;
}

export const BaseEntityCard = ({
  entity,
  index,
  footer,
  dialogExtraContent,
  cardExtraContent,
  showDefaultDates = true,
}: BaseEntityCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CardAnimation i={index}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Card className="bg-card p-4 sm:p-6 flex flex-col h-full cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all duration-300 w-full overflow-hidden">
            <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
              <div className="capitalize font-semibold text-sm sm:text-base truncate pr-2 text-foreground min-w-0 flex-1">
                {entity.projectName}
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <Badge className="capitalize rounded-[8px] font-semibold">{entity.environment}</Badge>
                {entity.group && <Badge variant="secondary">{entity.group}</Badge>}
              </div>
            </div>

            <CardHeaderComp title={entity.name} desc={entity.description} />

            {showDefaultDates && (
              <CardContent className="p-0 font-semibold text-xs sm:text-sm flex flex-col sm:flex-row gap-2 w-full my-5">
                <Button variant={'outline'} className="flex-1 text-xs sm:text-sm px-2 truncate" onClick={(e) => e.stopPropagation()}>
                  {new Date(entity.createdAt).toLocaleDateString()}
                </Button>
                <Button variant={'outline'} className="flex-1 text-xs sm:text-sm px-2 truncate" onClick={(e) => e.stopPropagation()}>
                  {new Date(entity.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Button>
              </CardContent>
            )}

            {cardExtraContent}

            {footer && (
              <CardFooter className="p-0 flex flex-col items-start gap-5 mt-auto w-full">
                {footer}
              </CardFooter>
            )}
          </Card>
        </DialogTrigger>

        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] p-0 overflow-hidden border-none shadow-2xl rounded-xl flex flex-col">
          <div className="bg-primary/5 p-4 sm:p-6 border-b shrink-0">
            <DialogHeader className="text-left">
              <DialogTitle className="text-lg sm:text-2xl font-bold leading-tight text-foreground break-words">
                {entity.name}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
              <Badge variant="outline" className="capitalize">
                {entity.environment}
              </Badge>
              {entity.group && <Badge variant="secondary">{entity.group}</Badge>}
            </div>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-6 box-border">
              <section>
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Project Name</h4>
                <p className="text-sm sm:text-base leading-relaxed text-foreground/90 break-words">{entity.projectName}</p>
              </section>

              <section>
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Description</h4>
                <p className="text-sm sm:text-base leading-relaxed text-foreground/90 break-words">
                  {entity.description || 'No description provided.'}
                </p>
              </section>

              {entity.filePath && (
                <section>
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                    <Terminal size={14} /> Source Location
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm border border-border/50 group relative">
                    <div className="break-all leading-normal text-foreground">
                      <span className="text-muted-foreground mr-1">Path:</span>
                      {entity.filePath}
                      {entity.lineNumber && (
                        <span className="text-primary font-bold ml-1">
                          :{entity.lineNumber}
                          {entity.columnNumber && `:${entity.columnNumber}`}
                        </span>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {entity.errorStack && (
                <section>
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                    <Terminal size={14} /> Error Stack
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm border border-border/50 group relative overflow-x-auto max-h-96 w-full">
                    <pre className="text-foreground whitespace-pre-wrap break-all text-xs sm:text-sm">
                      {(() => {
                        try {
                          const parsed = JSON.parse(entity.errorStack);
                          return Array.isArray(parsed) ? parsed.join('\n') : JSON.stringify(parsed, null, 2);
                        } catch {
                          return entity.errorStack;
                        }
                      })()}
                    </pre>
                  </div>
                </section>
              )}

              {entity.additionalErrorInfo && (
                <section>
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                    <Terminal size={14} /> Additional Error Info
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm border border-border/50 group relative overflow-x-auto max-h-96 w-full">
                    <pre className="text-foreground whitespace-pre text-xs sm:text-sm">
                      {(() => {
                        try {
                          const parsed = JSON.parse(entity.additionalErrorInfo);
                          return typeof parsed === 'object' ? JSON.stringify(parsed, null, 2) : parsed;
                        } catch {
                          return entity.additionalErrorInfo;
                        }
                      })()}
                    </pre>
                  </div>
                </section>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted/30 p-3 rounded-lg border border-border/40">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-tight mb-1">
                    <Hash size={14} /> Total Events
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-foreground">{entity.occurrences}</div>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border border-border/40">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-tight mb-1">
                    <Calendar size={14} /> First Occurrence
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-foreground break-words">
                    {new Date(entity.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </div>
                </div>
              </div>

              {dialogExtraContent}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </CardAnimation>
  );
};
