<script>
  import { page } from '$app/stores';

  const navLinks = [
    { href: '/',              label: 'Accueil' },
    { href: '/presentation',  label: 'Comprendre' },
    { href: '/pedagogie',     label: 'Pas à pas' },
    { href: '/usage-1',       label: 'Démonstrateur' },
    { href: '/grammaires',    label: 'Grammaires' },
    { href: '/documentation', label: 'Documentation' },
  ];
</script>

<header class="sticky top-0 z-50 border-b border-mrc-100 bg-white/95 backdrop-blur-sm">
  <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">

    <!-- Logo / identité -->
    <a href="/" class="flex items-center gap-2 text-mrc-800 hover:text-mrc-900">
      <span class="text-sm font-bold tracking-tight">Registres de communalité</span>
      <span class="rounded bg-mrc-100 px-1.5 py-0.5 text-xs font-medium text-mrc-600">MRC v5.5</span>
    </a>

    <!-- Navigation principale -->
    <ul class="hidden items-center gap-1 md:flex">
      {#each navLinks as link}
        <li>
          <a
            href={link.href}
            class="nav-link"
            class:nav-link--active={$page.url.pathname === link.href ||
              (link.href !== '/' && $page.url.pathname.startsWith(link.href))}
          >
            {link.label}
          </a>
        </li>
      {/each}
    </ul>

    <!-- Gouvernance (lien secondaire) -->
    <a href="/gouvernance" class="hidden text-xs text-mrc-500 hover:text-mrc-700 md:block">
      Gouvernance & RGPD
    </a>

  </nav>
</header>
