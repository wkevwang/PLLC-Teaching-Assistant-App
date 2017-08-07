import React, { Component } from 'react';
import { Button, Card, Grid, Rating, Header, Icon, Divider, Modal, Form, Input, Dimmer, Loader } from 'semantic-ui-react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import * as firebase from 'firebase';
import * as FirebaseHelper from '../FirebaseHelper';
import StudentFormPage from './StudentFormPage';
import StudentCard from '../components/StudentCard';
import StudentList from '../components/StudentList';
import StudentForm from '../components/StudentForm';

class ForumPage extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      forum: null,
      students: []
    }

    this.getForumFromFirebase();
    this.getStudentsOfForumFromFirebase();
  }

  getForumFromFirebase() {
    const forumId = this.props.match.params.id;
    firebase.database()
      .ref(`forums/${forumId}`)
      .on('value', snapshot => {
        this.setState({
          forum: snapshot.val(),
          loading: false
        });
      });
  }

  getStudentsOfForumFromFirebase() {
    const forumId = this.props.match.params.id;
    firebase.database()
      .ref('students')
      .orderByChild('forum')
      .equalTo(forumId)
      .on('value', snapshot => {
         this.setState({
          students: FirebaseHelper.snapshotToArray(snapshot),
        });
      });
  }

  componentWillUnmount() {
    firebase.database().ref('students/').off();
    firebase.database().ref('forums/').off();
  }

  render() {
    const forumId = this.props.match.params.id;

    return (
      <div style={{ padding: '40px' }}>
        {this.state.loading &&
          <Dimmer active>
            <Loader />
          </Dimmer>
        }
        {!this.state.loading && this.state.forum &&
          <Grid>
            <Grid.Row columns={3} centered verticalAlign='middle'>
              <Grid.Column textAlign='center'>
                <Header as='h1' icon>
                  <Icon name='users' />
                </Header>
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <Header as='h1' icon>
                  <Header.Content>
                    Forum {this.state.forum.year + this.state.forum.letter}
                  </Header.Content>
                  <Header.Subheader>
                    {this.state.forum.name}
                  </Header.Subheader>
                  <Header.Subheader style={{ paddingTop: '3px' }}>
                    {this.state.students.length + ' scholar' + (this.state.students.length === 1 ? '' : 's')}
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <StudentForm forum={forumId} />
              </Grid.Column>
            </Grid.Row>
            <Divider />
            {this.state.students.map &&
              <Grid.Row>
                <Card.Group>
                  {this.state.students.map((student, index) => (
                    <StudentCard key={index} {...student} />
                  ))}
                </Card.Group>
              </Grid.Row>
            }
          </Grid>
        }
      </div>
    );
  }
}

export default ForumPage;