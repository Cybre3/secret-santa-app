import React from 'react';
import { connect } from 'react-redux';
import Joi from 'joi-browser';

import { getCurrentUser, setCurrentGroup } from '../../store/users';
// import { getCurrentUser as getlocalUser } from '../../services/authService';
import withRouter from '../../utilities/withRouter';

import Form from '../common/form/Form';

class ChooseGroup extends Form {
    state = {
        data: {
            group: ''
        },
        groups: [],
        errors: {}
    }

    schema = {
        group: Joi.string().required().label('Group')
    }

    async componentDidMount() {
        try {
            const [user] = await this.props.currentUser(this.props.params.id);
            this.setState({ groups: user.groups });
        } catch (error) {
            console.log(error.message);
        }
    }

    groupOptions = groups => groups.map(group => ({ id: group.name, name: 'group', value: group.name }));

    btnClass = 'cursor-pointer rounded border border-black my-4 px-4 py-1 hover:bg-green-700 hover:text-white bg-white';

    doSubmit = () => {
        this.props.setCurrentGroup(this.state.data.group, this.props.params.id)
        window.location = `/secret-santa/${this.props.params.id}`;
    }

    render() {
        const { groups } = this.state;
        return (
            <div className='bg-black/40 w-screen h-screen absolute m-auto top-0 bottom-0 left-0 right-0 flex items-center justify-center'>
                <form onSubmit={this.handleSubmit} className='w-fit h-fit p-10 bg-white shadow-md shadow-black border-2 border-black flex flex-col items-center space-y-4 rounded'>
                    <h3 className='font-bold text-lg tracking-wide uppercase'>
                        Choose your group
                    </h3>
                    {this.renderDropdown('group', 'Group:', groups ? this.groupOptions(groups) : [])}
                    {this.renderButton('Continue', '', 'text-center', this.btnClass)}
                </form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    currentUser: userId => getCurrentUser(userId)(state),
});

const mapDispatchToProps = dispatch => ({
    setCurrentGroup: (group, id) => dispatch(setCurrentGroup(group, id))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChooseGroup))