<template>
  <div>
    <v-row justify="center">
      <v-col
        cols="auto"
        class="card-width"
      >
        <v-card>
          <!-- ** Card header -->
          <v-card-subtitle>
            <v-row>
              <v-col cols="auto">
                {{ metadata.name ?? "Untitled" }}
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
            v-if="metadata.image"
            contain
            :src="metadata.image"
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

              <div v-if="metadata.description">
                DESCRIPTION: {{ metadata.description }}
              </div>
            </div>

            <div
              v-if="item.batchId && metadata.description"
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
      const metadata = JSON.parse(item.metadata);
      console.log("Item metadata: ", metadata);

      // If metadata.image is ipfs://, create URL to IPFS image
      if (metadata.image && metadata.image.startsWith("ipfs://")) {
        const ipfsHash = metadata.image.split("ipfs://")[1];
        metadata.image = `https://ipfs.realitems.io/ipfs/${ipfsHash}`;
      }

      return { item, metadata };
    } catch (error) {
      console.error(error);
      // TODO: Use better errors and show in UI
      error({ statusCode: 404, message: "err message" });
    }
  },

  data: () => ({
    // item: is defined in asyncData
    // metadata: is defined in asyncData
  }),

  created() {},

  methods: {},
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

/* Fix image skeleton loader */
/* https://github.com/vuetifyjs/vuetify/issues/11771 */
::v-deep .v-skeleton-loader > * {
  height: 100%;
}
</style>
