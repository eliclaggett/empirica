<script>
  export let factors;
  export let lines = false;
</script>

{#each Object.keys(factors) as key, i}
  <span class={lines ? "block truncate" : ""}>
    <span class="font-medium">
      {key}
    </span>
    <span class="font-light truncate" title={JSON.stringify(factors[key])}>
      {#if factors[key] === Object(factors[key])}
        {#if factors[key].length}
          [{factors[key].join(", ")}]
        {:else}
          {"{"}
          {#each Object.keys(factors[key]) as k, j}
            {k}: {factors[key][k]}
            {#if j !== Object.keys(factors[key]).length - 1}
              ,
            {/if}
          {/each}
          {"}"}
        {/if}
      {:else}
        {factors[key]}
      {/if}
      {#if !lines && i !== Object.keys(factors).length - 1}
        {" | "}
      {/if}
    </span>
  </span>
{/each}
