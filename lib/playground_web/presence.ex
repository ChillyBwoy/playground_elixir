defmodule PlaygroundWeb.Presence do
  use Phoenix.Presence,
    otp_app: :playground,
    pubsub_server: Playground.PubSub

  alias Playground.Auth

  @impl true
  def fetch(_topic, presences) do
    users = presences |> Map.keys() |> Auth.get_user_map_by_ids()

    for {key, %{metas: metas}} <- presences, into: %{} do
      {key, %{metas: metas, user: users[key]}}
    end
  end
end
