defmodule Playground.PubSub do
  alias Phoenix.PubSub

  @topic "playground:pubsub"

  def subscribe() do
    PubSub.subscribe(Playground.PubSub, @topic)
  end

  def notify({:ok, message}, event) do
    PubSub.broadcast(Playground.PubSub, @topic, {event, message})
    {:ok, message}
  end

  def notify({:error, reason}, _event), do: {:error, reason}
end
