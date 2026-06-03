/* Design-system Select (el-select) as an HTML-string helper.
   Mirrors design-system/preview/components/select.html, but uses the
   prototype's named token utilities (bg-surface, outline-border, …) instead
   of arbitrary var() values, and a mobile tap target (py-2.5).

   Behavior comes from @tailwindplus/elements (loaded in index.html); the
   Lucide chevron/check icons are processed by the global rurio:icons-refresh. */

function optionRow(o) {
  return `
        <el-option value="${o.value}" class="group/option relative block cursor-default py-2 pr-9 pl-3 text-fg select-none focus:bg-accent focus:text-accent-fg focus:outline-hidden">
          <span class="block truncate font-normal group-aria-selected/option:font-semibold">${o.label}</span>
          <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-accent-text group-not-aria-selected/option:hidden group-focus/option:text-accent-fg in-[el-selectedcontent]:hidden">
            <i data-lucide="check" aria-hidden="true" class="size-5"></i>
          </span>
        </el-option>`;
}

/* Render an el-select control (without the surrounding label).
   `value` selects the initial option; defaults to the first option. */
export function selectControl({ id, name, options, value }) {
  const current =
    options.find(o => o.value === value) || options[0] || { value: "", label: "—" };
  return `
      <el-select id="${id}" name="${name || id}" value="${current.value}" class="mt-1.5 block">
        <button type="button" class="grid w-full cursor-default grid-cols-1 rounded-md bg-surface py-2.5 pr-2 pl-3 text-left text-sm font-medium text-fg outline-1 -outline-offset-1 outline-border focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-border-focus">
          <el-selectedcontent class="col-start-1 row-start-1 truncate pr-6">${current.label}</el-selectedcontent>
          <i data-lucide="chevron-down" aria-hidden="true" class="col-start-1 row-start-1 size-4 self-center justify-self-end text-fg-subtle"></i>
        </button>
        <el-options anchor="bottom start" popover class="max-h-60 w-(--button-width) overflow-auto rounded-md bg-surface py-1 text-sm shadow-lg outline-1 outline-border-subtle [--anchor-gap:--spacing(1)] data-leave:transition data-leave:transition-discrete data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0">
          ${options.map(optionRow).join("")}
        </el-options>
      </el-select>`;
}
