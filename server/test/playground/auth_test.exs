defmodule Playground.AuthTest do
  use Playground.DataCase

  alias Playground.Auth

  describe "users" do
    alias Playground.Auth.User

    import Playground.AuthFixtures

    @invalid_attrs %{username: nil, provider: nil, email: nil, avatar_url: nil}

    test "list_users/0 returns all users" do
      user = user_fixture()
      assert Auth.list_users() == [user]
    end

    test "get_user!/1 returns the user with given id" do
      user = user_fixture()
      assert Auth.get_user!(user.id) == user
    end

    test "create_user/1 with valid data creates a user" do
      valid_attrs = %{
        username: "some username",
        provider: "some provider",
        email: "some email",
        avatar_url: "some avatar_url"
      }

      assert {:ok, %User{} = user} = Auth.create_user(valid_attrs)
      assert user.username == "some username"
      assert user.provider == "some provider"
      assert user.email == "some email"
      assert user.avatar_url == "some avatar_url"
    end

    test "create_user/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Auth.create_user(@invalid_attrs)
    end

    test "update_user/2 with valid data updates the user" do
      user = user_fixture()

      update_attrs = %{
        username: "some updated username",
        provider: "some updated provider",
        email: "some updated email",
        avatar_url: "some updated avatar_url"
      }

      assert {:ok, %User{} = user} = Auth.update_user(user, update_attrs)
      assert user.username == "some updated username"
      assert user.provider == "some updated provider"
      assert user.email == "some updated email"
      assert user.avatar_url == "some updated avatar_url"
    end

    test "update_user/2 with invalid data returns error changeset" do
      user = user_fixture()
      assert {:error, %Ecto.Changeset{}} = Auth.update_user(user, @invalid_attrs)
      assert user == Auth.get_user!(user.id)
    end

    test "delete_user/1 deletes the user" do
      user = user_fixture()
      assert {:ok, %User{}} = Auth.delete_user(user)
      assert_raise Ecto.NoResultsError, fn -> Auth.get_user!(user.id) end
    end

    test "change_user/1 returns a user changeset" do
      user = user_fixture()
      assert %Ecto.Changeset{} = Auth.change_user(user)
    end
  end
end
