<template>
  <div>
    <v-row justify="center">
      <v-col
        cols="auto"
        class="card-width"
      >
        <!-- ** Item card -->
        <v-card>
          <!-- ** Card header -->
          <v-card-subtitle>
            <v-row>
              <v-col cols="auto">
                {{ item.metadata.name ?? "Untitled" }}
              </v-col>
              <v-col
                cols="auto"
                class="ml-auto"
              >
                <a
                  v-if="item.transactionUrl"
                  :href="item.transactionUrl"
                  target="_blank"
                >
                  <v-img
                    width="20"
                    src="/polygon_logo.svg"
                  />
                </a>

                <v-img
                  v-else
                  width="20"
                  src="/polygon_logo.svg"
                />
              </v-col>
            </v-row>
          </v-card-subtitle>

          <!-- ** Image -->
          <v-img
            v-if="item.metadata.image"
            contain
            :src="item.metadata.image"
            max-width="100%"
            aspect-ratio="1"
          >
            <template #placeholder>
              <v-skeleton-loader
                type="image"
                width="100%"
                height="100%"
                tile
              />
            </template>
          </v-img>

          <div v-else>
            <v-divider class="light-hr" />
          </div>

          <!-- ** Card text -->
          <v-card-text>
            <div class="details-full">
              <div v-if="item.batchId">
                BATCH ID: {{ item.batchId }}
              </div>

              <div v-if="item.metadata.description">
                DESCRIPTION: {{ item.metadata.description }}
              </div>
            </div>

            <div
              v-if="item.batchId && item.metadata.description"
              class="my-2"
            />

            <div class="details">
              ITEM ID: {{ item.itemId }}
              <br>

              CONTRACT:
              <a
                :href="item.contractUrl"
                target="_blank"
              >{{
                item.contractAddress
              }}</a>
              <br>

              TRANSACTION:
              <a
                v-if="item.transactionUrl"
                :href="item.transactionUrl"
                target="_blank"
              >{{ item.mintTransaction.hash }}</a>

              <span v-else>
                {{ item.transactionStatus }}
              </span>
              <br>

              IPFS:
              <a
                :href="item.ipfsUrl"
                target="_blank"
              >{{
                item.metadataHash
              }}</a>
            </div>
          </v-card-text>
        </v-card>

        <!-- ** Memories button -->
        <div class="text-center mt-8">
          <v-btn
            v-if="memoriesStatus === 'not checked'"
            class="pulse-button grey--text"
            elevation="1"
            color="white"
            light
            rounded
            small
            width="210"
            @click="viewMemories"
          >
            View memories
          </v-btn>

          <v-btn
            v-else
            class="grey--text"
            :class="{
              'pulse-button': memoriesStatus === 'checking',
            }"
            elevation="1"
            color="white"
            light
            rounded
            small
            width="210"
            style="pointer-events: none"
          >
            {{
              // Show different text depending on status
              memoriesStatus === "checking"
                ? "Checking ..."
                : memoriesStatus === "no memories"
                  ? "No memories found"
                  : "Memories"
            }}
          </v-btn>
        </div>

        <!-- Memory cards.. -->
        <v-card
          v-for="memory in memories"
          :key="memory.memoryId"
          class="mt-8"
        >
          <!-- ** Card header -->
          <v-card-subtitle>
            <v-row>
              <v-col
                class="details-full"
                cols="auto"
              >
                FROM: {{ memory.from }}
              </v-col>
              <v-col
                v-if="memory.transactionUrl"
                cols="auto"
                class="ml-auto"
              >
                <a
                  :href="memory.transactionUrl"
                  target="_blank"
                >
                  <v-icon>mdi-arrow-top-right</v-icon>
                </a>
              </v-col>
            </v-row>
          </v-card-subtitle>

          <v-divider class="light-hr" />

          <!-- ** Card text -->
          <v-card-text class="text-caption">
            <pre>{{ JSON.stringify(memory.metadata, null, 2) }}</pre>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  async asyncData({ $getItem, error, route }) {
    const itemId = route.params.itemId;

    // Check that itemId is in uuid v4 format
    const uuidV4Regex = new RegExp(
      "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
      "i"
    );

    if (!uuidV4Regex.test(itemId)) {
      console.log("Invalid itemId");

      error({ statusCode: 404, message: "err message" });
      return;
    }

    // Get item data
    try {
      const getItemResponse = await $getItem(itemId);

      console.log("Item response: ", getItemResponse);

      // Check status of API call
      const status = getItemResponse?.data?.status;
      if (!status || !status.success) {
        console.log("Error getting item");

        error({ statusCode: 404, message: "err message" });
        return;
      }

      const item = getItemResponse.data.body;
      console.log("Item data: ", item);

      const networkPrefix =
        item.blockchainNetwork === "mumbai" ? "mumbai." : "";

      // Create URL to contract
      item.contractUrl = `https://${networkPrefix}polygonscan.com/address/${item.contractAddress}`;

      // Create URL to blockchain transaction
      if (item.mintTransaction.hash) {
        item.transactionUrl = `https://${networkPrefix}polygonscan.com/tx/${item.mintTransaction.hash}`;
      } else if (item.mintTransaction.status === "failed") {
        item.transactionStatus = "Failed transaction";
      } else {
        item.transactionStatus = "Pending transaction";
      }

      // Create URL to IPFS metadata
      item.ipfsUrl = `https://ipfs.realitems.io/ipfs/${item.metadataHash}`;

      // Parse metadata
      item.metadata = JSON.parse(item.metadata);
      console.log("Item metadata: ", item.metadata);

      // If metadata.image is ipfs://, create URL to IPFS image
      if (item.metadata.image && item.metadata.image.startsWith("ipfs://")) {
        const ipfsHash = item.metadata.image.split("ipfs://")[1];
        item.metadata.image = `https://ipfs.realitems.io/ipfs/${ipfsHash}`;
      }

      return { item };
    } catch (error) {
      console.error(error);
      // TODO: Use better errors and show in UI
      error({ statusCode: 404, message: "err message" });
    }
  },

  data: () => ({
    // item: is defined in asyncData
    memoriesStatus: "not checked",
    memories: undefined,
  }),

  created() {},

  methods: {
    async viewMemories() {
      this.memoriesStatus = "checking";

      try {
        const listMemoriesResponse = await this.$listMemoriesByItemId(
          this.item.itemId
        );

        console.log("Memories response: ", listMemoriesResponse);

        // Check status of API call
        const status = listMemoriesResponse?.data?.status;
        if (!status || !status.success) {
          throw new Error("Error getting memories");
        }

        const memories = listMemoriesResponse.data.body;

        if (memories.length > 0) {
          this.memories = memories.map((memory) => {
            memory.metadata = JSON.parse(memory.metadata);
            console.log("Memory: ", memory);

            memory.from = memory.metadata.from ?? "Unknown";
            delete memory.metadata.from;

            const networkPrefix =
              memory.blockchainNetwork === "mumbai" ? "mumbai." : "";

            // Create URL to blockchain transaction
            if (memory.mintTransaction.hash) {
              memory.transactionUrl = `https://${networkPrefix}polygonscan.com/tx/${memory.mintTransaction.hash}`;
            }

            return memory;
          });

          this.memoriesStatus = "memories";
        } else {
          this.memoriesStatus = "no memories";
        }
      } catch (error) {
        console.error(error);
        this.memoriesStatus = "no memories";
      }
    },
  },
};
</script>

<style lang="SCSS" scoped>
.card-width {
  width: 500px;
}

.light-hr {
  border-bottom: 0.1px solid #f0f0f0;
}

.details {
  font-size: 0.8rem;
  font-family: monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.details-full {
  font-size: 0.8rem;
  font-family: monospace;
}

/* Class that makes a button pulse  */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pulse-button {
  animation: pulse 2.5s infinite;
}

/* Fix image skeleton loader */
/* https://github.com/vuetifyjs/vuetify/issues/11771 */
::v-deep .v-skeleton-loader > * {
  height: 100%;
}

pre {
  white-space: pre-wrap; /* Since CSS 2.1 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
}
</style>
