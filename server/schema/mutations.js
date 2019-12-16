const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID, } = graphql;

const UserType = require("./types/user_type");
const AuthService = require("../services/auth");

const ArtistType = require("./types/artist_type");
const Artist = mongoose.model("artists");

const PlaylistType = require("./types/playlist_type");
const Playlist = mongoose.model("playlists");

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    newPlaylist: {
      type: PlaylistType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString }
      },
      resolve(_, { title, description }) {
        return new Playlist({ title, description }).save();
      }
    },
    deletePlaylist: {
      type: PlaylistType,
      args: { id: { type: GraphQLID } },
      resolve(_, { id }) {
        return Playlist.remove({ _id: id });
      }
    },
    updatePlaylist: {
      type: PlaylistType,
      args: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString }
      },
      resolve(_, { id, title, description }) {
        const updateObj = {};

        if (id) updateObj.id = id;
        if (title) updateObj.title = title;
        if (description) updateObj.description = description;

        return Playlist.findOneAndUpdate(
          { _id: id },
          { $set: updateObj },
          { new: true },
          (err, playlist) => {
            return playlist;
          }
        );
      }
    },
    register: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.register(args);
      }
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.login(args);
      }
    },
    logout: {
      type: UserType,
      args: {
        _id: { type: GraphQLID }
      },
      resolve(_, args) {
        return AuthService.logout(args);
      }
    },
    verifyUser: {
      type: UserType,
      args: {
        token: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.verifyUser(args);
      }
    },

    newArtist: {
      type: ArtistType,
      args: {
        name: { type: GraphQLString },
        imageUrl: { type: GraphQLString }
      },
      resolve(parentValue, { name, imageUrl }) {
        return new Artist({ name, imageUrl }).save();
      }
    }
  }
});

module.exports = mutation;
