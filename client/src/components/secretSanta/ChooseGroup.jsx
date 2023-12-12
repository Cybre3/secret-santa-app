import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import Joi from 'joi-browser';

import { getCurrentUser } from '../../store/users';
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
            console.log(error.message)
        }
    }

    groupOptions = groups => groups.map(group => ({ id: group.name, name: 'group', value: group.name }));

    btnClass = 'cursor-pointer rounded border border-black my-4 px-4 py-1 hover:bg-green-700 hover:text-white bg-white';

    doSubmit = () => {

    }

    render() {
        const { groups } = this.state;
        return (
            <form onSubmit={this.doSubmit} className='w-fit h-fit p-10 bg-white shadow-md shadow-black border-2 border-black absolute m-auto top-0 bottom-0 left-0 right-0 flex flex-col items-center space-y-4 rounded'>
                <h3 className='font-bold text-lg tracking-wide uppercase'>
                    Choose your group
                </h3>
                {this.renderDropdown('group', 'Group:', groups ? this.groupOptions(groups) : [])}
                {this.renderButton('Continue', '', 'text-center', this.btnClass)}
            </form>
        )
    }
}

const mapStateToProps = state => ({
    users: state.entities.users.list,
    currentUser: userId => getCurrentUser(userId)(state)
});

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChooseGroup))