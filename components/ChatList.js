import React from 'react';
import { 
  StyleSheet, 
  Text, 
  Button, 
  View,
  Modal,
  TextInput,
  Image, 
  Alert,
  FlatList,
} from 'react-native';
import { Chat } from '@skrumble/js-sdk';

const initialState = { 
  chats: []
}

export default class ChatList extends React.Component {

  constructor(opts) {
    super(opts);
    this.state = initialState;
  }

  componentDidMount() {

    Chat.getAll({ limit: 10 }).then((chats) => this.setState({ chats }));

  }

  renderGroupItem(chat) {

    return (
      <View style={styles.listItem}>

        <View style={{ width: 50, height: 50 }}>
          { 
            chat.avatar != 'null' ? 
							<Image
								style={styles.listImage}
								source={{ uri: chat.avatar || '' }} 
							/>
            : 
            <Text>No avatar</Text>
          }
        </View>

        <View style={styles.listItemText}>  
            { !!chat.name ?
              <Text>{chat.name}</Text>
              : 
              <Text>{chat.users.map((user) => user.first_name).join(', ')}</Text>
            }
						<Text style={{ fontStyle: 'italic' }}>{chat.purpose}</Text>
        </View>
      </View>
    )

  }

  renderPrivateItem(chat) {

    if (chat && chat.users) {
      const otherUser = chat.users.find((user) => (user.id != this.props.loggedInUser.id));

      return (
        <View style={styles.listItem}>

          <View>
            <Image
              style={styles.listImage}
              source={{ uri: chat.users[0].avatar || '' }} 
            />
          </View>

          <View style={styles.listItemText}>  
						<Text>{chat.users.map((user) => user.first_name).join(', ')}</Text>
          </View>
        </View>
      )
    } 

  }

  render() {
    return (
      <FlatList
        data={this.state.chats}
        renderItem={(listItem) => (listItem.item.type == 'group') ? this.renderGroupItem(listItem.item) : this.renderPrivateItem(listItem.item)}
      />
    )

  }
  
}

const styles = StyleSheet.create({

	listItemImage: { 
		width: 50, 
		height: 50 
	},

	listItemText: {
		paddingLeft: 10 
	},

	listItem: {
		flex: 1, 
		flexDirection: 'row', 
		height: 70, 
		marginBottom: 10,
		fontSize: 14,
	}
});
