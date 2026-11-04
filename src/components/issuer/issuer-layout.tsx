import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import {
  Building2Icon,
  CalendarClockIcon,
  ChevronsUpDownIcon,
  HouseIcon,
  LandmarkIcon,
  LogOutIcon,
  type LucideIcon,
} from 'lucide-react';
import { type CSSProperties, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/brand/logo';
import { LanguageToggle } from '@/components/common/language-toggle';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { cancelRefresh } from '@/lib/fetcher';
import { issuerKeys, issuerMeOptions } from '@/queries/issuer/options';
import { issuerLogout } from '@/queries/issuer/query';

type NavKey = 'dashboard' | 'bonds' | 'schedule';

interface NavItem {
  title: NavKey;
  to?: '/issuer';
  icon: LucideIcon;
}

const navGroups: { label: 'general' | 'bonds'; items: NavItem[] }[] = [
  {
    label: 'general',
    items: [{ title: 'dashboard', to: '/issuer', icon: HouseIcon }],
  },
  {
    // The issuer's bonds and their payment schedule come with the bond module.
    label: 'bonds',
    items: [
      { title: 'bonds', icon: LandmarkIcon },
      { title: 'schedule', icon: CalendarClockIcon },
    ],
  },
];

const titles: Record<string, NavKey> = {
  '/issuer': 'dashboard',
};

function useIssuerLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useCallback(async () => {
    cancelRefresh('issuer');
    try {
      await issuerLogout();
    } catch {
      // 204 even without a session; a network error still leaves locally.
    }
    queryClient.removeQueries({ queryKey: issuerKeys.all });
    await navigate({ to: '/issuer/login' });
  }, [queryClient, navigate]);
}

/** A bond issuer member's pages: the customer web's sidebar layout, with their own menu. */
export function IssuerLayout() {
  const { t } = useTranslation();
  const pathname = useLocation({ select: (l) => l.pathname });
  const current = titles[pathname.replace(/\/$/, '')];

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 64)',
          '--header-height': 'calc(var(--spacing) * 14)',
        } as CSSProperties
      }
    >
      <IssuerSidebar pathname={pathname} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 rounded-t-xl border-b bg-background/85 px-4 backdrop-blur-md lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
          <span className="text-sm font-medium">
            {current ? t(`issuer.nav.${current}`) : ''}
          </span>
          <div className="ml-auto flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <div
          key={pathname}
          className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 animate-in fade-in-0 slide-in-from-bottom-1 duration-300 motion-reduce:animate-none md:p-6 lg:p-8"
        >
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function IssuerSidebar({ pathname }: { pathname: string }) {
  const { t } = useTranslation();
  const { data } = useSuspenseQuery(issuerMeOptions());
  const logout = useIssuerLogout();
  const { member, issuer } = data;
  const name = `${member.last_name} ${member.first_name}`;
  const initials =
    `${member.last_name.charAt(0)}${member.first_name.charAt(0)}`.toUpperCase();
  const active = pathname.replace(/\/$/, '');

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="h-14 justify-center">
        <Link to="/issuer" className="flex items-center px-1">
          <Logo className="group-data-[collapsible=icon]:[&>span:last-child]:hidden" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>
              {t(`issuer.nav.${group.label}`)}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.to ? (
                      <SidebarMenuButton
                        asChild
                        isActive={active === item.to}
                        tooltip={t(`issuer.nav.${item.title}`)}
                      >
                        <Link to={item.to}>
                          <item.icon />
                          <span>{t(`issuer.nav.${item.title}`)}</span>
                        </Link>
                      </SidebarMenuButton>
                    ) : (
                      <>
                        <SidebarMenuButton
                          disabled
                          tooltip={t('nav.comingSoon', {
                            title: t(`issuer.nav.${item.title}`),
                          })}
                          className="opacity-60"
                        >
                          <item.icon />
                          <span>{t(`issuer.nav.${item.title}`)}</span>
                        </SidebarMenuButton>
                        <SidebarMenuBadge className="rounded-full bg-muted px-1.5 text-[10px] text-muted-foreground">
                          {t('common.soon')}
                        </SidebarMenuBadge>
                      </>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        {/* Which company the member acts for, always in sight. */}
        <div className="rounded-lg border bg-card p-3 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2">
            <Building2Icon className="size-4 shrink-0 text-muted-foreground" />
            <div className="grid min-w-0 text-xs leading-tight">
              <span className="truncate font-medium">{issuer.name}</span>
              <span className="truncate text-muted-foreground">
                {t('issuer.title')} · {issuer.register_number}
              </span>
            </div>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {t(`issuer.role.${member.role}`)}
                    </span>
                  </div>
                  <ChevronsUpDownIcon className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
              >
                <DropdownMenuLabel className="font-normal">
                  <p className="truncate text-sm font-medium text-foreground">
                    {name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {member.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => void logout()}
                >
                  <LogOutIcon />
                  {t('common.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
