<script>
  import { focus } from "../../utils/use";
  import LabelBox from "../common/LabelBox.svelte";

  export let config;
  let value = JSON.stringify(config, null, "  ");

  $: parseConfig(value);

  function parseConfig(value) {
    try {
      const newConf = JSON.parse(value);
      config = newConf;
    } catch (err) {
      config = value;
    }
  }
</script>

<LabelBox label="Configuration" forID="batch-configuration">
  <textarea
    use:focus
    bind:value
    id="batch-configuration"
    name="configuration"
    rows="10"
    data-test="configurationTextArea"
    class="block w-full px-3 py-2 shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-empirica-500 focus:border-transparent border border-transaparent rounded-md"
  />

  <div
    class="flex flex-col space-between sm:flex-row sm:items-center sm:space-between mt-2"
  >
    <div>
      <div class="group flex items-center text-sm text-gray-500 space-x-2">
        <!-- Heroicon name: solid/question-mark-circle -->
        <svg
          class="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clip-rule="evenodd"
          />
        </svg>
        <span> Must be valid JSON.</span>
      </div>
    </div>
  </div>
</LabelBox>
