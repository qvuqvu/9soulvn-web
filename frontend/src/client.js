import client from "@sanity/client"

export default client({
  projectId: "511tg0cm",
  dataset: "production",
  useCdn: true,
  apiVersion: "2022-07-27",
})