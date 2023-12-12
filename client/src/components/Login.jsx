import React from 'react';
import Joi from 'joi-browser';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { getCurrentUser } from '../services/authService';

import Form from './common/form/Form';
import { checkUserEmail, loginUser } from '../store/users';

class Login extends Form {
    state = {
        data: {
            email: '',
            password: ''
        },
        emailVerified: false,
        errors: {}
    }

    schema = {
        email: Joi.string().email().required().label('Email'),
        password: Joi.string().allow('').label('Passowrd')
    }

    inputClasses = {
        inputContainer: 'flex flex-col space-y-2 w-[75%]',
        inputClass: 'rounded-sm outline outline-1 pl-3 py-1 tx-sm w-full'
    }

    btnClass = 'cursor-pointer rounded border border-black my-4 px-4 py-1 hover:bg-green-700 hover:text-white';

    doSubmit = async () => {
        let { email, password } = this.state.data;
        const { emailVerified } = this.state;
        email = email.toLowerCase();

        if (emailVerified) {
            try {
                await this.props.loginUser({ email, password })
                this.setState({ emailVerified: false })
                window.location = `/secret-santa/${getCurrentUser()._id}`;
            } catch (error) {
                console.log(error.message)
            }
        }
        else {
            try {
                await this.props.checkUserEmail(email);
                this.setState({ emailVerified: this.props.users.emailVerified ? true : false })
            } catch (error) {
                console.log(error.message)
            }
        }

    }

    render() {
        return (
            <div className='w-screen h-screen overflow-hidden bg-green-800 flex items-center'>

                <form onSubmit={this.handleSubmit} className='mx-auto py-6 h-fit w-[25%] flex flex-col bg-neutral-50 rounded space-y-10 items-center border border-black border-2 shadow-md shadow-white'>

                    <h2 className='text-2xl font-bold tracking-wider uppercase'>Login</h2>

                    {this.renderInput('email', 'Email', 'email', '', this.inputClasses)}
                    {this.state.emailVerified && this.props.users.emailVerified && this.renderInput('password', 'Password', 'password', '', this.inputClasses)}

                    {this.renderButton(this.state.emailVerified ? 'Login' : 'Continue', '', '', this.btnClass)}

                    <p>Not a registered Secret Santa? Register
                        <NavLink to='/register' className='text-blue-700 ml-1'>
                            Here
                        </NavLink>
                        !
                    </p>

                </form>

            </div >
        )
    }
}

const mapStateToProps = state => ({
    users: state.entities.users
});

const mapDispatchToProps = dispatch => ({
    loginUser: user => dispatch(loginUser(user)),
    checkUserEmail: email => dispatch(checkUserEmail(email))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);