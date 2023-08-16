defmodule PlaygroundWeb.LightLive do
  use PlaygroundWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, assign(socket, :brightness, 10)}
  end

  def render(assigns) do
    ~H"""
    <h1>Front Porch Light</h1>
    <div class="flex overflow-hidden bg-slate-400 rounded-xl mb-8 h-16">
      <span class="flex flex-col justify-center bg-amber-400 text-center whitespace-nowrap font-bold text-2xl transition width delay-150 ease-in-out" style={"width: #{@brightness}%"}>
        <%= @brightness %>%
      </span>
    </div>
    <div class="flex justify-between">
      <button phx-click="off" class="h-12 px-8 rounded-lg border border-slate-800 font-bold">Off</button>
      <button phx-click="down" class="h-12 px-8 rounded-lg border border-slate-800 font-bold">Down</button>
      <button phx-click="up" class="h-12 px-8 rounded-lg border border-slate-800 font-bold">Up</button>
      <button phx-click="on" class="h-12 px-8  rounded-lg border border-slate-800 font-bold">On</button>
    </div>
    """
  end

  def handle_event("off", _, socket) do
    socket = assign(socket, :brightness, 0)
    {:noreply, socket}
  end

  def handle_event("down", _, socket) do
    socket = update(socket, :brightness, &max(&1 - 10, 0))
    {:noreply, socket}
  end

  def handle_event("up", _, socket) do
    socket = update(socket, :brightness, &min(&1 + 10, 100))
    {:noreply, socket}
  end

  def handle_event("on", _, socket) do
    socket = assign(socket, :brightness, 100)
    {:noreply, socket}
  end
end
