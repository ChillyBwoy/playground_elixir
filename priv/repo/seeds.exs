# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Playground.Repo.insert!(%Playground.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Playground.Auth
alias Playground.Chat
alias Playground.Chat.Room

{:ok, user} = Auth.create_user(%{
  email: "chill.icp@gmail.com",
  username: "ChillyBwoy",
  avatar_url: "https://avatars.githubusercontent.com/u/72079?v=4",
  provider: "github"
})

rooms = [
  %Room{
    name: "First Room",
    user_id: user.id
  },
  %Room{
    name: "Second Room",
    user_id: user.id
  },
  %Room{
    name: "Third Room",
    user_id: user.id
  }
]

Enum.each(rooms, fn room ->
  Chat.create_room(room)
end)
