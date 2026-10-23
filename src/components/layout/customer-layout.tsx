import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, Outlet, useLocation } from '@tanstack/react-router';
import {
  ChevronsUpDownIcon,
  FileTextIcon,
  HouseIcon,
  LandmarkIcon,
  LogOutIcon,
  type LucideIcon,
  ShieldCheckIcon,
  UserRoundIcon,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/brand/logo';
import { LanguageToggle } from '@/components/common/language-toggle';
import { StatusBadge } from '@/components/common/status-badge';
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
import { useLogout } from '@/hooks/use-logout';
import { initials } from '@/lib/client';
import { meOptions } from '@/queries/auth/options';
import { displayName } from '@/queries/auth/type';

type NavKey = 'dashboard' | 'bonds' | 'contracts' | 'profile' | 'security';

interface NavItem {
  title: NavKey;
  to?: '/' | '/profile' | '/security';
  icon: LucideIcon;
}

const navGroups: {
  label: 'general' | 'investment' | 'account';
  items: NavItem[];
}[] = [
  {
    label: 'general',
    items: [{ title: 'dashboard', to: '/', icon: HouseIcon }],
  },
  {
    // Bonds, contracts and certificates come with their modules.
    label: 'investment',
    items: [
      { title: 'bonds', icon: LandmarkIcon },
      { title: 'contracts', icon: FileTextIcon },
    ],
  },
  {
    label: 'account',
    items: [
      { title: 'profile', to: '/profile', icon: UserRoundIcon },
      { title: 'security', to: '/security', icon: ShieldCheckIcon },
    ],
  },
];

const titles: Record<string, NavKey> = {
  '/': 'dashboard',
  '/profile': 'profile',
  '/security': 'security',
};

export function CustomerLayout() {
  const { t } = useTranslation();
  const pathname = useLocation({ select: (l) => l.pathname });

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 64)',
          '--header-height': 'calc(var(--spacing) * 14)',
        } as CSSProperties
      }
    >
      <CustomerSidebar pathname={pathname} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 rounded-t-xl border-b bg-background/85 px-4 backdrop-blur-md lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
          <span className="text-sm font-medium">
            {titles[pathname] ? t(`nav.${titles[pathname]}`) : ''}
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

function CustomerSidebar({ pathname }: { pathname: string }) {
  const { t } = useTranslation();
  const { data: me } = useSuspenseQuery(meOptions());
  const logout = useLogout();
  const name = displayName(me);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="h-14 justify-center">
        <Link to="/" className="flex items-center px-1">
          <Logo className="group-data-[collapsible=icon]:[&>span:last-child]:hidden" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{t(`nav.${group.label}`)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.to ? (
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.to}
                        tooltip={t(`nav.${item.title}`)}
                      >
                        <Link to={item.to}>
                          <item.icon />
                          <span>{t(`nav.${item.title}`)}</span>
                        </Link>
                      </SidebarMenuButton>
                    ) : (
                      <>
                        <SidebarMenuButton
                          disabled
                          tooltip={t('nav.comingSoon', {
                            title: t(`nav.${item.title}`),
                          })}
                          className="opacity-60"
                        >
                          <item.icon />
                          <span>{t(`nav.${item.title}`)}</span>
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
        {/* Where the client stands in review, always in sight. */}
        <div className="rounded-lg border bg-card p-3 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {t('home.kyc.account')}
            </span>
            <StatusBadge status={me.status} />
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
                      {initials(me)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {me.email ?? me.phone}
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
                    {me.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <UserRoundIcon />
                    {t('nav.profile')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/security">
                    <ShieldCheckIcon />
                    {t('nav.security')}
                  </Link>
                </DropdownMenuItem>
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
