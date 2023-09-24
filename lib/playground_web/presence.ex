defmodule PlaygroundWeb.Presence do
  use Phoenix.Presence,
    otp_app: :playground,
    pubsub_server: Playground.PubSub

  alias Playground.Auth

  def fetch(_topic, presences) do
    users = presences |> Map.keys() |> Auth.get_user_map_by_ids()

    for {key, %{metas: metas}} <- presences, into: %{} do
      {key, %{metas: metas, user: users[key]}}
    end
  end

  def init(_opts), do: {:ok, %{}}

  def handle_metas(topic, %{joins: joins, leaves: leaves}, presences, state) do
    for {user_id, presence} <- joins do
      user_data = %{user: presence.user, metas: Map.fetch!(presences, user_id)}
      broadcast(topic, %{user_joined: user_data})
    end

    for {user_id, presence} <- leaves do
      metas =
        case Map.fetch(presences, user_id) do
          {:ok, presence_metas} -> presence_metas
          :error -> []
        end

      user_data = %{user: presence.user, metas: metas}
      broadcast(topic, %{user_left: user_data})
    end

    {:ok, state}
  end

  def track_user(%Phoenix.Socket{} = socket, user_id) do
    track(socket, user_id, %{
      joined_at: inspect(System.system_time(:second))
    })
  end

  def track_user(topic, user_id) do
    track(self(), topic, user_id, %{
      joined_at: inspect(System.system_time(:second))
    })
  end

  def untrack_user(%Phoenix.Socket{} = socket, user_id), do: untrack(socket, user_id)

  def untrack_user(topic, user_id), do: untrack(self(), topic, user_id)

  defp broadcast(topic, payload) do
    Phoenix.PubSub.broadcast(
      Playground.PubSub,
      topic,
      {PlaygroundWeb.PresenceClient, payload}
    )
  end
end
