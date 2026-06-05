/**
 * Helper for placeholder pages: returns a minimal page module with meta + render().
 * Used for routes wired in the bottom nav before their real screens are built.
 */
export function stubPage({ id, label, icon, showInNav = false }) {
  const iconHtml = `<i data-lucide="${icon}" class="size-9"></i>`;

  return {
    meta: { id, label, icon, showInNav },
    render(target) {
      target.innerHTML = `
        <section class="px-4 pt-10 pb-10 sm:px-6 xl:px-8 xl:pt-16">
          <div class="max-w-md mx-auto xl:mx-0 text-center xl:text-left">
            <div class="mx-auto xl:mx-0 flex size-16 items-center justify-center rounded-2xl bg-accent-subtle text-accent-text">
              ${iconHtml}
            </div>
            <h1 class="mt-4 text-3xl font-bold tracking-tight text-fg sm:text-4xl">${label}</h1>
            <p class="mt-2 text-base text-fg-muted">
              Această pagină este în pregătire. Componentele și conținutul vor fi adăugate în fazele următoare.
            </p>
            <a href="#/" class="mt-5 inline-flex items-center gap-1.5 text-base font-semibold text-accent-text hover:underline underline-offset-2">
              <i data-lucide="arrow-left" class="size-4"></i>
              Înapoi la Acasă
            </a>
          </div>
        </section>
      `;
    },
  };
}
