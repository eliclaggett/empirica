<script>
  import { formatFactorsToString } from "../../utils/treatments.js";
  import Badge from "../common/Badge.svelte";
  import TimeSince from "../common/TimeSince.svelte";

  export let game;
  export let players;
  export let playersStatusMap;

  let statusColor = "gray";
  let status = "Created";
  $: {
    if (game.get("ended")) {
      status = "Ended";
      statusColor = "red";
    } else if (game.get("start")) {
      status = "Running";
      statusColor = "green";
    }
  }

  console.log(game);

  function getPlayerIconClass(player) {
    if (!player.online) return "text-red-400";
    if (player.ready) return "text-green-400";

    if (player.overflow) return "text-orange-300";

    return "text-gray-400";
  }

  $: treatments = game.get("treatment");
  $: playerCount = treatments ? treatments["playerCount"] : 0;
  $: p = players
    ? players
        .filter((p) => p.get("gameID") === game.id)
        .sort((a, b) => {
          if (
            (a.get("introDone") && b.get("introDone")) ||
            (!a.get("introDone") && !b.get("introDone"))
          ) {
            return 0;
          }

          if (a.get("introDone")) {
            return -1;
          } else {
            return 1;
          }
        })
    : [];

  let playersList = [];
  $: {
    if (playerCount > 0 && p) {
      playersList = [];
      for (let i = 0; i < Math.max(playerCount, p.length); i++) {
        const player = p[i];
        playersList.push({
          player,
          id: player && player.id,
          ready: player && player.get("introDone"),
          overflow: i + 1 > playerCount,
          online: player && playersStatusMap.get(player.get("participantID")),
        });
      }
    }
  }
</script>

<tr>
  <!-- <td
    class="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
  >
    {game.get("index")}
  </td> -->
  <td class="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
    <Badge color={statusColor}>
      {status}
    </Badge>
  </td>
  <td
    class="whitespace-nowrap px-3 py-2 text-sm text-gray-500"
    title={formatFactorsToString(game.get("treatment"), "\n")}
  >
    {game.get("treatmentName") || ""}
  </td>
  <td class="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
    {#if game.get("start")}
      <TimeSince time={new Date(game.attrs["start"]["createdAt"])} />
    {/if}
  </td>
  <td class="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
    {#if game.get("ended")}
      <TimeSince time={new Date(game.attrs["ended"]["createdAt"])} />
    {/if}
  </td>
  <td class="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
    {playersList.length}
  </td>
  <td
    class="relative whitespace-nowrap py-2 pl-3 pr-4 text-sm
  font-medium sm:pr-0 space-x-2 space-y-2"
  >
    {#each playersList as plyr}
      <div class="inline-block w-4 h-4">
        {#if plyr.player}
          <span
            class={getPlayerIconClass(plyr)}
            title={plyr.player.get("participantID")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              class="mx-auto h-full w-full"
              fill="currentColor"
              ><path
                d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"
              /></svg
            >
          </span>
        {:else}
          <span class="text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              class="mx-auto h-full w-full"
              fill="currentColor"
              ><path
                d="M272 304h-96C78.8 304 0 382.8 0 480c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32C448 382.8 369.2 304 272 304zM48.99 464C56.89 400.9 110.8 352 176 352h96c65.16 0 119.1 48.95 127 112H48.99zM224 256c70.69 0 128-57.31 128-128c0-70.69-57.31-128-128-128S96 57.31 96 128C96 198.7 153.3 256 224 256zM224 48c44.11 0 80 35.89 80 80c0 44.11-35.89 80-80 80S144 172.1 144 128C144 83.89 179.9 48 224 48z"
              /></svg
            >
          </span>
        {/if}
      </div>
    {/each}
  </td>

  <!-- <div class="flex w-full items-between justify-between space-x-6 p-6">
    <div class="flex-1 truncate">
      <div class="flex items-center space-x-3">
        <Badge color={statusColor}>
          {status}
        </Badge>
      </div>
      <p class="mt-1 truncate text-sm text-gray-500">
        {#if treatments}
          <FactorsString lines factors={treatments} />
        {/if}
      </p>
    </div>
  </div>
  <div class="p-6 space-x-2 space-y-2" /> -->
</tr>
